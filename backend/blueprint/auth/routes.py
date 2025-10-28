from flask import render_template, redirect,url_for,current_app, Blueprint,request,template_rendered, Blueprint, jsonify
from backend.blueprint.models import User, UserStats, UserItems
from sqlalchemy.orm import load_only
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from backend.extensions import db
from flask_login import login_user, current_user, logout_user, login_required

CONTACT_LIST_URL = "/contactList"

auth_bp = Blueprint("auth", __name__)

@auth_bp.route(CONTACT_LIST_URL, methods=["GET"])
def get_all_users():
    try:
        users = User.query.options(
            #load_only method allow to only selected columns to display
            load_only(User.id, User.first_name, User.last_name, User.email)
        ).all()
    except SQLAlchemyError as wankery:
        current_app.logger.exception("Error querying users")
        return jsonify({wankery: "No users to load"})
    return jsonify([user.get_user_credentials_dict() for user in users]), 200


PG_UNIQUE     = "23505"
PG_NOT_NULL   = "23502"
PG_CHECK_FAIL = "23514"
PG_FK_VIOL    = "23503"

@auth_bp.route("/register", methods=["POST"])
def register_user():
    register_data = request.get_json(force=True) or {}
    first = (register_data.get("first_name")or "").strip()
    last = (register_data.get("last_name") or "").strip()
    email = (register_data.get("email") or "").strip().lower()
    age = (register_data.get("age") or "")
    pwd   = register_data.get("password") or ""

    if not (first and last and email and pwd and age):
        return jsonify({"error": "missing fields"}), 400

    user = User(first_name=first, last_name=last, email=email, age=age)

    try:
        age_int_check = int(age)
        if age_int_check < 2:
            return jsonify({"error": "age must be >= 2"}), 400

    except Exception:
        return jsonify({"error": "age must be an integer"}), 400

    user.set_password(pwd)
    db.session.add(user)
    db.session.flush()

    stats = UserStats(
        user_id=user.id,
        days_logged_in=0,
        quizzes_completed=0,
        current_level=1,   # >= 1
        modules_completed=0,
        total_xp=0,
        xp_in_level=0,
        xp_to_next=100,    # > 0
        last_login_date=None,
    )
    db.session.add(stats)

    items = UserItems(
        user_id=user.id,
        oxygen_level_amount=0,
        oxygen_cannisters=0,
    )
    db.session.add(items)
    login_user(user)

    try:
        # user.stats = UserStats()
        # user.items = UserItems()
        db.session.commit()
        return jsonify({"Success": "User has been successfully registered"}), 200

    except IntegrityError as e:
        db.session.rollback()
        orig = getattr(e, "orig", None)
        code = getattr(orig, "pgcode", None)
        cname = getattr(getattr(orig, "diag", None), "constraint_name", None)
        # Log to server console for fast diagnosis
        print("REGISTER IntegrityError:", code, cname, str(orig))

        if code == PG_UNIQUE:
            # e.g. users_email_key or uq_users_email_ci
            return jsonify({"error": "email already in use", "constraint": cname}), 409
        if code == PG_NOT_NULL:
            return jsonify({"error": "missing required fields", "constraint": cname}), 400
        if code == PG_CHECK_FAIL:
            return jsonify({"error": "check constraint failed", "constraint": cname}), 400
        if code == PG_FK_VIOL:
            return jsonify({"error": "foreign key violation", "constraint": cname}), 400
        return jsonify({"error": "integrity error", "code": code, "constraint": cname}), 400



@auth_bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    pwd   = data.get("password") or ""
    user = db.session.query(User).filter_by(email=email).first()


    if not user or not user.verify_password(pwd):
        return jsonify({"Login Error": "invalid credentials"}), 401
    login_user(user)  # sets session cookie
    if not user.stats:
        user.stats = UserStats()
    UserStats.apply_login_streak(user.stats)
    db.session.commit()
    return jsonify({"user": user.get_user_credentials_dict_public()}), 200


@auth_bp.post("/logout")
@login_required
def logout():
    logout_user()
    return "User logged out successfully", 204


@auth_bp.get("/me")
def me():
    if not current_user.is_authenticated:
        return jsonify({"user": "Unauthorised!"}), 401
    return jsonify({"user": current_user.get_user_credentials_dict_public()}), 200






