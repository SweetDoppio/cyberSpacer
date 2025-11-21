from flask import Blueprint

from ..models.question import Question
from .routes import quiz_bp

bp = quiz_bp

__all__ = ["bp"]