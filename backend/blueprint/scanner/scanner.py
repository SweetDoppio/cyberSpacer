# backend/scanner.py
from __future__ import annotations
import time
import socket
import ipaddress
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin, urlparse, parse_qs, urlencode

import requests
from bs4 import BeautifulSoup as bs
import validators

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EKHOScanner/1.0; +https://yourtool.example)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

HTML_LIKE = {"text/html", "application/xhtml+xml"}

SQLI_ERROR_SNIPPETS = [
    "sql syntax",
    "mysql_fetch",
    "odbc_exec",
    "unclosed quotation mark",
    "unterminated string",
    "syntax error",
]

PRIVATE_V4 = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
]
PRIVATE_V6 = [
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def _is_private_host(host: str) -> bool:
    try:
        infos = socket.getaddrinfo(host, None, proto=socket.IPPROTO_TCP)
    except socket.gaierror:
        return False  # unknown host ≠ private; let the request fail naturally
    for family, _, _, _, sockaddr in infos:
        ip_str = sockaddr[0]
        ip = ipaddress.ip_address(ip_str)
        if ip.version == 4 and any(ip in net for net in PRIVATE_V4):
            return True
        if ip.version == 6 and any(ip in net for net in PRIVATE_V6):
            return True
    return False

def _validate_target_url(url: str) -> tuple[bool, Optional[str]]:
    if not url or not isinstance(url, str):
        return False, "URL is required."
    if not url.startswith(("http://", "https://")):
        return False, 'URL must start with "https://" or "http://".'
    if not validators.url(url):
        return False, "Invalid URL format."
    parsed = urlparse(url)
    if _is_private_host(parsed.hostname or ""):
        return False, "Target resolves to a private or link-local address (blocked)."
    return True, None

def _looks_html(resp: requests.Response) -> bool:
    ctype = (resp.headers.get("Content-Type") or "").split(";")[0].strip().lower()
    return (not ctype) or (ctype in HTML_LIKE)

class Scanner:
    """Stateless-ish scanner instance for one target URL."""

    def __init__(self, url: str, session: Optional[requests.Session] = None, timeout: float = 7.0):
        self.url = url
        self.errors: List[str] = []
        self.timeout = timeout
        self.sess = session or requests.Session()
        self.sess.headers.update(DEFAULT_HEADERS)

    # ---------- Helpers ----------
    def _safe_request(self, method: str, url: str, **kwargs) -> Optional[requests.Response]:
        """Perform request and validate each redirect hop for SSRF."""
        kwargs.setdefault("timeout", self.timeout)
        kwargs.setdefault("allow_redirects", True)
        try:
            resp = self.sess.request(method.upper(), url, **kwargs)
        except requests.RequestException as e:
            self.errors.append(f"{method} {url}: {e}")
            return None

        # Validate final and redirect chain hosts
        chain = list(resp.history) + [resp]
        for hop in chain:
            parsed = urlparse(hop.url)
            if _is_private_host(parsed.hostname or ""):
                self.errors.append(f"Blocked redirect/target to private host: {parsed.hostname}")
                return None
        return resp

    # ---------- Public API ----------
    def validate_url(self) -> bool:
        ok, err = _validate_target_url(self.url)
        if not ok and err:
            self.errors.append(err)
        return ok

    def get_all_forms(self) -> List[Any]:
        resp = self._safe_request("GET", self.url)
        if not resp or not _looks_html(resp):
            return []
        soup = bs(resp.text, "html.parser")
        return soup.find_all("form")

    def get_form_details(self, form) -> Dict[str, Any]:
        action = (form.attrs.get("action") or "").strip()
        method = (form.attrs.get("method") or "get").lower()
        inputs: List[Dict[str, Any]] = []
        for input_tag in form.find_all("input"):
            input_type = input_tag.attrs.get("type", "text").lower()
            input_name = input_tag.attrs.get("name")
            input_value = input_tag.attrs.get("value")
            inputs.append({"type": input_type, "name": input_name, "value": input_value})
        return {"action": action, "method": method, "inputs": inputs}

    def submit_form(self, form_details: Dict[str, Any], payload: str) -> Optional[requests.Response]:
        target_url = urljoin(self.url, form_details.get("action") or "")
        data: Dict[str, Any] = {}

        for input_desc in form_details.get("inputs", []):
            itype = (input_desc.get("type") or "text").lower()
            name = input_desc.get("name")
            if not name:
                continue
            if itype in {"text", "search", "email", "url"}:
                data[name] = payload
            else:
                # keep existing default when available (e.g., hidden CSRF tokens)
                value = input_desc.get("value")
                if value is not None:
                    data[name] = value

        if (form_details.get("method") or "get").lower() == "post":
            return self._safe_request("POST", target_url, data=data)
        return self._safe_request("GET", target_url, params=data)

    # ---------- Checks ----------
    def check_https(self) -> Dict[str, Any]:
        out = {
            "url": self.url,
            "is_https": False,
            "redirects_to_https": False,
            "security_issues": [],  # strings
        }
        try:
            if self.url.startswith("https://"):
                out["is_https"] = True
                return out

            if self.url.startswith("http://"):
                resp = self._safe_request("GET", self.url)
                if not resp:
                    out["security_issues"].append("Request failed.")
                    return out
                if resp.url.startswith("https://"):
                    out["redirects_to_https"] = True
                else:
                    out["security_issues"].append("Site does not redirect to HTTPS.")
        except Exception as e:
            out["security_issues"].append(f"Error checking HTTPS: {e}")
        return out

    def scan_xss(self) -> Dict[str, Any]:
        out = {"url": self.url, "form_count": 0, "vulnerable_forms": []}  # list of {action, method}
        payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg/onload=alert('XSS')>",
            "'\"><script>alert('XSS')</script>",
            "<script>alert('Hope your site is secure =]')</script>",
        ]
        forms = self.get_all_forms()
        out["form_count"] = len(forms)
        for form in forms:
            details = self.get_form_details(form)
            for payload in payloads:
                resp = self.submit_form(details, payload)
                if not resp:
                    continue
                if not _looks_html(resp):
                    continue
                content = resp.text[:1_000_000]  # soft cap
                if payload in content:
                    out["vulnerable_forms"].append(
                        {"action": urljoin(self.url, details.get("action") or ""), "method": details.get("method", "get")}
                    )
                    break
        return out

    def scan_sqli(self) -> Dict[str, Any]:
        out = {"url": self.url, "param_count": 0, "vulnerable_params": []}  # list of {name, payload}
        payloads = [
            "'",
            "' OR '1'='1",
            '" OR "1"="1',
            "' OR 1=1--",
            "'; DROP TABLE users--",
            "' OR SLEEP(3)--",
        ]

        # Case 1: URL query parameters
        parsed = urlparse(self.url)
        query_params = parse_qs(parsed.query)  # dict[str, List[str]]
        if query_params:
            for param in list(query_params.keys()):
                for payload in payloads:
                    test_params = {k: (v if isinstance(v, list) else [v]) for k, v in query_params.items()}
                    test_params[param] = [payload]  # override single param with payload
                    query = urlencode(test_params, doseq=True)
                    test_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{query}"

                    start = time.time()
                    resp = self._safe_request("GET", test_url)
                    if not resp:
                        continue
                    elapsed = time.time() - start
                    content = resp.text[:1_000_000].lower()

                    if any(err in content for err in SQLI_ERROR_SNIPPETS):
                        out["vulnerable_params"].append({"name": param, "payload": payload})
                        break
                    if elapsed > 2.5:
                        out["vulnerable_params"].append({"name": param, "payload": f"{payload} (blind)"})
                        break

        # Case 2: form-based injection
        for form in self.get_all_forms():
            details = self.get_form_details(form)
            for input_desc in details.get("inputs", []):
                name = input_desc.get("name")
                if not name:
                    continue
                for payload in payloads:
                    params = {name: payload}
                    target = urljoin(self.url, details.get("action") or "")
                    start = time.time()
                    if (details.get("method") or "get").lower() == "post":
                        resp = self._safe_request("POST", target, data=params)
                    else:
                        resp = self._safe_request("GET", target, params=params)
                    if not resp:
                        continue
                    elapsed = time.time() - start
                    content = resp.text[:1_000_000].lower()

                    if any(err in content for err in SQLI_ERROR_SNIPPETS):
                        out["vulnerable_params"].append({"name": name, "payload": payload})
                        break
                    if elapsed > 2.5:
                        out["vulnerable_params"].append({"name": name, "payload": f"{payload} (blind)"})
                        break

        out["param_count"] = len(out["vulnerable_params"])
        return out

    def scan(self, checks: Optional[List[str]] = None) -> Dict[str, Any]:
        checks = checks or ["https", "xss", "sqli"]
        started = time.time()

        result: Dict[str, Any] = {"url": self.url, "checks": {}, "errors": self.errors}
        if not self.validate_url():
            result["duration_ms"] = int((time.time() - started) * 1000)
            return result

        if "https" in checks:
            result["checks"]["https"] = self.check_https()
        if "xss" in checks:
            result["checks"]["xss"] = self.scan_xss()
        if "sqli" in checks:
            result["checks"]["sqli"] = self.scan_sqli()

        result["errors"] = self.errors
        result["duration_ms"] = int((time.time() - started) * 1000)
        return result
