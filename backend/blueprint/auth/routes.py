from flask import render_template, redirect, url_for,Blueprint,request,template_rendered

from backend.blueprint.auth import auth_bp
from backend import db