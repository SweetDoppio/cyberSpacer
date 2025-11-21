from flask import Blueprint, jsonify
from ..models.user import User
from .routes import auth_bp

bp = auth_bp
