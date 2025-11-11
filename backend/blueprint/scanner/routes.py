from __future__ import annotations
from flask import Blueprint, request, jsonify
from .scanner import Scanner, _validate_target_url


scanner_bp = Blueprint("scanner", __name__, url_prefix="/api")

@scanner_bp.route("/scan", methods=["POST"])
def scan():
    """
    JSON body:
      { "url": "https://example.com", "checks": ["https","xss","sqli"] }
    """
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()
    checks = data.get("checks") or ["https", "xss", "sqli"]

    ok, err = _validate_target_url(url)
    if not ok:
        return jsonify({"url": url, "checks": {}, "errors": [err], "duration_ms": 0}), 400

    scanner = Scanner(url)
    result = scanner.scan(checks=checks)

    return jsonify(result), 200