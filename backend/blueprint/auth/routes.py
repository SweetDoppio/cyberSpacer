from flask import render_template, redirect, url_for,Blueprint,request,template_rendered, Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.get("/ping")
def ping():
    return jsonify(message="auth ok")



