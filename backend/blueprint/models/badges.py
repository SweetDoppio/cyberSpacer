# backend/models/badge.py
from sqlalchemy import String, Text
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.extensions import db

# Association table for User <-> Badge (many-to-many)
user_badges = db.Table(
    "user_badges",
    db.Column("user_id",  db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    db.Column("badge_id", db.Integer, db.ForeignKey("badges.id", ondelete="CASCADE"), primary_key=True),
    db.UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
)

if TYPE_CHECKING:
    # Only imported for type checking; avoids circular import at runtime
    from .user import User

class Badge(db.Model):
    __tablename__ = "badges"

    id:   Mapped[int]  = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str]  = mapped_column(String(64), unique=True, index=True, nullable=False)  # e.g. "network-master"
    name: Mapped[str]  = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)

    users: Mapped[list["User"]] = relationship(
        secondary="user_badges", back_populates="badges", lazy="selectin"
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Badge {self.slug}>"
