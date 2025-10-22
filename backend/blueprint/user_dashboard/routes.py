from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from backend.extensions import db
from backend.blueprint.models import UserStats


stats_bp = Blueprint("stats", __name__)

def _ensure_stats() -> UserStats:
    s = getattr(current_user, "stats", None)
    if s is None:
        s = UserStats()
        current_user.stats = s
        db.session.add(s)
    return s

@stats_bp.get("/stats")
@login_required
def get_my_stats():
    s = _ensure_stats()
    db.session.commit()  # in case we just created it
    return jsonify({"stats": s.to_dict()}), 200

@stats_bp.post("/stats/touch")
@login_required
def touch_login_streak():
    s = _ensure_stats()
    s.apply_login_streak()
    db.session.commit()
    return jsonify({"stats": s.to_dict()}), 200

@stats_bp.post("/stats/earn_xp")
@login_required
def earn_xp():
    data = request.get_json(force=True) or {}
    try:
        amount = int(data.get("amount", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "amount must be an integer"}), 400
    if amount <= 0:
        return jsonify({"error": "amount must be > 0"}), 400

    s = _ensure_stats()
    s.earn_xp(amount)
    db.session.commit()
    return jsonify({"stats": s.to_dict()}), 200