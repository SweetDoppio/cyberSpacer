from __future__ import annotations
import json, pathlib, random, time

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from backend.extensions import db


quiz_bp = Blueprint('quiz', __name__)
QUIZ_DIR = pathlib.Path(__file__).resolve().parents[1] / "quiz" / "quiz_file"

QUESTION_LIMIT_DEFAULT = 10

#to check if quiz dir is actually pointing to where quiz json is
print(f"QUIZ DIR --> {QUIZ_DIR}")

_attempts: dict[str, dict] = {}
def _load_quiz(slug: str) -> dict:
    path = (QUIZ_DIR / f"{slug}.json").resolve()
    if not path.is_file():
        # 404 is nicer to the client than a 500 stacktrace
        raise FileNotFoundError(f"quiz not found: {slug}")
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return _normalize_quiz(raw)

def _sanitize_for_client(q: dict) -> dict:
    out_qs = []
    for item in q["questions"]:
        opts = list(item["options"])
        random.shuffle(opts)
        out_qs.append({
            "id": item["id"],
            "text": item["text"],
            "options": [{"id": o["id"], "text": o["text"]} for o in opts],
        })
    return {"slug": q["slug"], "title": q["title"], "questions": out_qs}

def _normalize_quiz(raw: dict | list) -> dict:
    # support either {"questions":[...]} or a naked list [...]
    items = raw.get("questions") if isinstance(raw, dict) else raw
    if items is None:
        items = []

    norm_qs = []
    for i, item in enumerate(items):
        qid   = str(item.get("id") or item.get("index") or i)
        qtext = item.get("text") or item.get("question") or ""
        ans   = str(item.get("answer") or item.get("correct") or "")
        expl  = item.get("explanation") or item.get("why") or ""  # <-- keep explanation

        opts = []
        for opt in item.get("options", []):
            oid = str(opt.get("id") or opt.get("value"))
            opts.append({"id": oid, "text": opt.get("text", "")})

        norm_qs.append({
            "id": qid,
            "text": qtext,
            "options": opts,
            "answer": ans,
            "explanation": expl,          # <-- keep it
        })

    return {
        "slug": (raw.get("slug") if isinstance(raw, dict) else None) or "intro",
        "title": (raw.get("title") if isinstance(raw, dict) else None) or "Quiz",
        "questions": norm_qs,
    }


@quiz_bp.post("/start")
@login_required
def start_quiz():
    payload = request.get_json(silent=True) or {}
    slug = (payload.get("slug") or "").strip()
    if not slug:
        return jsonify({"error": "missing slug"}), 400

    limit = int(payload.get("limit", QUESTION_LIMIT_DEFAULT))
    limit = max(1, min(limit, 50))
    q = _load_quiz(slug)
    sanitized = _sanitize_for_client(q)


    answers = {it["id"]: it["answer"] for it in q["questions"]}
    explanations = {it["id"]: it.get("explanation") for it in q["questions"]}

    attempt_id = f"{current_user.id}:{slug}:{int(time.time())}"
    _attempts[attempt_id] = {
        "user_id": current_user.id,
        "slug": slug,
        "answers": answers,
        "explanations": explanations,
        "answers_user": {},     # question_id -> chosen option id
        "submitted": False,
        "xp_on_pass": int(q.get("xp_on_pass", 0)),
        "pass_threshold": int(q.get("pass_threshold", 70)),
    }
    return jsonify({"attempt_id": attempt_id, "quiz": sanitized}), 200

@quiz_bp.post("/answer")
@login_required
def grade_one():
    """Check a single answer; if correct, grant +5% O₂ on the server."""
    payload = request.get_json(silent=True) or {}
    attempt_id = payload.get("attempt_id")
    qid = payload.get("question_id")
    ans = payload.get("answer")

    att = _attempts.get(attempt_id)
    if not att or att["user_id"] != current_user.id or att["submitted"]:
        return jsonify({"error": "invalid attempt"}), 400
    if not (qid and ans):
        return jsonify({"error": "missing question/answer"}), 400

    correct = att["answers"].get(qid) == ans
    att["answers_user"][qid] = ans

    # Server-side oxygen gains 2% if correct
    if correct:
        from backend.blueprint.user_items.routes import apply_oxygen_gain_for_user
        apply_oxygen_gain_for_user(current_user.id, 2)  # applies caps/rollover rules, hopefully
        db.session.commit()

    return jsonify({
        "correct": bool(correct),
        "correct_option_id": att["answers"][qid],
        "explanation": att["explanations"].get(qid),

    }), 200

@quiz_bp.post("/submit")
@login_required
def submit_quiz():
    payload = request.get_json(silent=True) or {}
    attempt_id = payload.get("attempt_id")

    att = _attempts.get(attempt_id)
    if not att or att["user_id"] != current_user.id or att["submitted"]:
        return jsonify({"error": "invalid attempt"}), 400

    # grade
    total = len(att["answers"])
    correct = sum(1 for qid, want in att["answers"].items()
                  if att["answers_user"].get(qid) == want)
    score_pct = int(round((correct / max(1, total)) * 100))

    # award xp only if user has passed the quiz
    earned = 0
    stats_dict = None
    if score_pct >= att["pass_threshold"]:
        from backend.blueprint.user_dashboard.routes import award_xp_for_user
        # Adjust the xp gain here
        earned_amount = int(att.get("xp_on_pass", 20))
        if score_pct >= att["pass_threshold"] and earned_amount > 0:
            s = award_xp_for_user(current_user.id, earned_amount)
            db.session.commit()
            stats_dict = {
                "user_id": s.user_id,
                "current_level": s.current_level,
                "total_xp": s.total_xp,
                "xp_in_level": s.xp_in_level,
                "xp_to_next": s.xp_to_next,
                "quizzes_completed": s.quizzes_completed,
                "days_logged_in": s.days_logged_in,
            }

    att["submitted"] = True
    return jsonify({"ok": True, "score_pct": score_pct, "earned": earned, "stats": stats_dict}), 200