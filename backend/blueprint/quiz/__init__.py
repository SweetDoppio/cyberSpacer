from flask import Blueprint

from .routes import quiz_bp

bp = quiz_bp

__all__ = ["bp"]