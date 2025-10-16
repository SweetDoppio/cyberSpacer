# somewhere after app is created
from sqlalchemy import text
from flask import render_template, redirect, url_for,Blueprint,request,template_rendered
from backend.blueprint.auth import auth_bp
from sqlalchemy import Boolean, Integer, String
from backend.extensions import db  # or your db object

user_dashboard_group_bp = Blueprint("user_dashboard_group_bp",__name__)

@user_dashboard_group_bp.get("/dbcheck")
def dbcheck():
    try:
        db.session.execute(text("SELECT 1"))
        return {"db": "ok"}, 200
    except Exception as e:
        return {"db": "error", "detail": str(e)}, 500

