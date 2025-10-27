from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from backend.extensions import db
from backend.blueprint.models import UserStats, User
from sqlalchemy import select, func

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

@stats_bp.get("/leaderboard")
@login_required
def leaderboard():
    try:
        limit = max(1, min(100, int(request.args.get("limit", 5))))
    except ValueError:
        limit = 10
    try:
        offset = max(0, int(request.args.get("offset", 0)))
    except ValueError:
        offset = 0

    stmt = (
        select(
            User.id,
            User.first_name,
            User.last_name,
            UserStats.total_xp,
            UserStats.current_level,
        )
        .join(UserStats, UserStats.user_id == User.id)
        .order_by(UserStats.total_xp.desc(), User.id.asc())
        .limit(limit)
        .offset(offset)
    )

    rows = db.session.execute(stmt).all()
    entries = [
        {
            "rank": offset + i + 1,
            "user": {
                "id": r.id,
                "first_name": r.first_name,
                "last_name": r.last_name,
            },
            "total_xp": r.total_xp,
            "current_level": r.current_level,
        }
        for i, r in enumerate(rows)
    ]

    me_stats = _ensure_stats()
    higher = db.session.scalar(
        select(func.count()).select_from(UserStats).where(UserStats.total_xp > me_stats.total_xp)
    )
    my_rank = int(higher or 0) + 1

    total_rows = db.session.scalar(select(func.count()).select_from(UserStats)) or 0

    db.session.commit()

    return jsonify({
        "entries": entries,
        "limit": limit,
        "offset": offset,
        "total": int(total_rows),
        "me": {
            "rank": my_rank,
            "total_xp": me_stats.total_xp,
            "current_level": me_stats.current_level,
        },
    }), 200