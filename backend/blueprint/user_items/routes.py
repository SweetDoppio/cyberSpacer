from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy import select
from backend.extensions import db
from backend.blueprint.models.items import UserItems

user_items_bp = Blueprint("user_items_bp", __name__)

MAX_CANNISTERS = 4      # hard limit of cannisters
CAP_AT_MAX = 50         # while at max cannisters, bar is capped at 50%
BAR_FULL = 100          # oxygen bar "capacity" before rolling into a cannister


def _get_or_create_items_locked(uid: int) -> UserItems:
    stmt = select(UserItems).where(UserItems.user_id == uid).with_for_update()
    items = db.session.execute(stmt).scalar_one_or_none()
    if not items:
        items = UserItems(user_id=uid)  # model-level defaults set zeros
        db.session.add(items)
        db.session.flush()
    return items

def apply_oxygen_gain_for_user(uid: int, amount: int) -> UserItems:
    if amount <= 0:
        raise ValueError("amount must be a positive integer")

    items = _get_or_create_items_locked(uid)

    level = items.oxygen_level_amount
    cans  = items.oxygen_cannisters

    if cans >= MAX_CANNISTERS:
        # At max cannisters: clamp level to 50%
        items.oxygen_level_amount = min(level + amount, CAP_AT_MAX)
        return items

    total = level + amount
    gained_cans = total // BAR_FULL
    leftover = total % BAR_FULL

    new_cans = min(cans + gained_cans, MAX_CANNISTERS)
    items.oxygen_cannisters = new_cans

    if new_cans >= MAX_CANNISTERS:
        # Hitting max on this gain: clamp leftover to 50%
        items.oxygen_level_amount = min(leftover, CAP_AT_MAX)
    else:
        items.oxygen_level_amount = leftover

    return items

def use_cannister_for_user(uid: int) -> UserItems:
    """
    Consume one cannister. No commit here.
    """
    items = _get_or_create_items_locked(uid)
    if items.oxygen_cannisters <= 0:
        raise ValueError("no cannisters to use")
    items.oxygen_cannisters -= 1
    return items

#Routes (thin wrappers)

@user_items_bp.get("/items")
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
    }), 200

@user_items_bp.post("/items/gain-oxygen")
@login_required
def gain_oxygen_route():
    data = request.get_json(force=True) or {}
    try:
        amount = int(data.get("amount", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "amount must be a positive integer"}), 400
    if amount <= 0:
        return jsonify({"error": "amount must be a positive integer"}), 400

    try:
        items = apply_oxygen_gain_for_user(current_user.id, amount)
        db.session.commit()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "user_id": items.user_id,
        "oxygen_level_amount": items.oxygen_level_amount,
        "oxygen_cannisters": items.oxygen_cannisters,
        "cap": CAP_AT_MAX if items.oxygen_cannisters >= MAX_CANNISTERS else BAR_FULL,
        "max_cannisters": MAX_CANNISTERS,
    }), 200

@user_items_bp.post("/items/use-cannister")
@login_required
def use_cannister_route():
    try:
        items = use_cannister_for_user(current_user.id)
        db.session.commit()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "user_id": items.user_id,
        "oxygen_level_amount": items.oxygen_level_amount,
        "oxygen_cannisters": items.oxygen_cannisters,
        "note": "cannister used; future gains can exceed 50 again",
        "cap": CAP_AT_MAX if items.oxygen_cannisters >= MAX_CANNISTERS else BAR_FULL,
        "max_cannisters": MAX_CANNISTERS,
    }), 200
