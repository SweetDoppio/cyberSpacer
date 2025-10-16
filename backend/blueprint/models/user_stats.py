from sqlalchemy.orm import Mapped
from backend import db
from enum import Enum


class UserStats(db.Model):

    user_id = Mapped[int]