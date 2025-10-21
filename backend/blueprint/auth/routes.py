from flask import render_template, redirect,url_for,current_app, Blueprint,request,template_rendered, Blueprint, jsonify
from backend.blueprint.models import User
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
    user.set_password(pwd)
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify({"Success": "User has been successfully registered"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email already in use"}), 409

    login_user(user)
    return jsonify({"user": user.get_user_credentials_dict_public()}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    pwd   = data.get("password") or ""
    user = db.session.query(User).filter_by(email=email).first()


    if not user or not user.verify_password(pwd):
        return jsonify({"Login Error": "invalid credentials"}), 401
    login_user(user)  # sets session cookie
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






