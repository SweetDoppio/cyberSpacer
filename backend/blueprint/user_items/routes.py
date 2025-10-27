# somewhere after app is createdfrom
#
from __future__ import annotations
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy import select
from backend.extensions import db
from backend.blueprint.models.items import UserItems


user_items_bp = Blueprint('user_items_bp', __name__)

MAX_CANNISTERS = 4
CAP_AT_MAX = 50
BAR_FULL = 100

def _get_or_create_items_locked(uid: int) -> UserItems:
    # Lock the row to avoid race conditions if user taps quickly
    stmt = select(UserItems).where(UserItems.user_id == uid).with_for_update()
    items = db.session.execute(stmt).scalar_one_or_none()
    if not items:
        items = UserItems(user_id=uid)  # server defaults will set zeros
        db.session.add(items)
        db.session.flush()  # get it persisted & lockable in this tx
    return items

@user_items_bp.route("/items")
@login_required
def get_my_items():
    items = db.session.execute(
        select(UserItems).where(UserItems.user_id == current_user.id)
    ).scalar_one_or_none()
    if not items:
        items = UserItems(user_id=current_user.id)
        db.session.add(items)
        db.session.commit()
    return jsonify({
        "user_id": items.user_id,
        "oxygen_level_amount": items.oxygen_level_amount,
        "oxygen_cannisters": items.oxygen_cannisters,
        "cap": CAP_AT_MAX if items.oxygen_cannisters >= MAX_CANNISTERS else BAR_FULL,
        "max_cannisters": MAX_CANNISTERS,
    })

@user_items_bp.post("/items/gain-oxygen")
@login_required
def gain_oxygen():
    data = request.get_json(force=True) or {}
    amount = int(data.get("amount", 0))
    if amount <= 0:
        return jsonify({"error": "amount must be a positive integer"}), 400

    items = _get_or_create_items_locked(current_user.id)

    level = items.oxygen_level_amount
    cans  = items.oxygen_cannisters

    if cans >= MAX_CANNISTERS:
        #If user has 4 cannisters, then, clamp that oxy bar to 50%
        new_level = min(level + amount, CAP_AT_MAX)
        items.oxygen_level_amount = new_level
        db.session.commit()
        return jsonify({
            "user_id": items.user_id,
            "oxygen_level_amount": items.oxygen_level_amount,
            "oxygen_cannisters": items.oxygen_cannisters,
            "note": "at max cannisters; level capped at 50 until a cannister is used",
        })

    total = level + amount
    gained_cans = total // BAR_FULL
    leftover = total % BAR_FULL

    new_cans = min(cans + gained_cans, MAX_CANNISTERS)
    items.oxygen_cannisters = new_cans

    if new_cans >= MAX_CANNISTERS:
        # Hitting max on this gain: clamp leftover to 50
        items.oxygen_level_amount = min(leftover, CAP_AT_MAX)
    else:
        items.oxygen_level_amount = leftover

    db.session.commit()
    return jsonify({
        "user_id": items.user_id,
        "oxygen_level_amount": items.oxygen_level_amount,
        "oxygen_cannisters": items.oxygen_cannisters,
    })

@user_items_bp.post("/items/use-cannister")
@login_required
def use_cannister():
    items = _get_or_create_items_locked(current_user.id)
    if items.oxygen_cannisters <= 0:
        return jsonify({"error": "no cannisters to use"}), 400

    items.oxygen_cannisters -= 1
    db.session.commit()
    return jsonify({
        "user_id": items.user_id,
        "oxygen_level_amount": items.oxygen_level_amount,
        "oxygen_cannisters": items.oxygen_cannisters,
        "note": "cannister used; future gains can exceed 50 again",
    })