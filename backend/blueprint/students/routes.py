from flask import render_template, redirect, url_for,Blueprint,request,template_rendered

student_bp = Blueprint("students", __name__, url_prefix="/")