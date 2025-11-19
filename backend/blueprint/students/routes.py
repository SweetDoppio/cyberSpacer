import os

from flask import render_template, redirect, url_for,Blueprint,request,template_rendered
import time
from flask import Blueprint, request, jsonify, current_app, url_for
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from backend.extensions import db

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

user_profile_bp = Blueprint("user_profile", __name__)

@user_profile_bp.route("/avatar", methods=["POST"])
@login_required
def upload_avatar():
    print(">>avatar hit upload")

    if "avatar" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["avatar"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"user-{current_user.id}-{int(time.time())}.{ext}")

    upload_folder = current_app.config["AVATAR_UPLOAD_FOLDER"]
    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    avatar_url = url_for("static", filename=f"avatars/{filename}", _external=False)

    current_user.avatar_url = avatar_url
    db.session.commit()

    return jsonify({"avatar_url": avatar_url})