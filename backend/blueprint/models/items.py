# backend/models/items.py
from sqlalchemy import Integer, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.extensions import db

class UserItems(db.Model):
    __tablename__ = "user_items"
    __table_args__ = (
        CheckConstraint("oxygen_level_amount >= 0", name="check_items_oxygen_level_non_neg"),
        CheckConstraint("oxygen_cannisters >= 0",   name="check_items_cannisters_non_neg"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )

    oxygen_level_amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    oxygen_cannisters:   Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    user: Mapped["User"] = relationship(back_populates="items")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<UserItems user_id={self.user_id}>"
