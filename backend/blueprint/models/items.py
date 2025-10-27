# backend/models/items.py
from sqlalchemy import Integer, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.extensions import db

class UserItems(db.Model):
    __tablename__ = "user_items"

    #Makes sure things stay non-funky and within boundaries
    __table_args__ = (
        # non-negative level
        CheckConstraint("oxygen_level_amount >= 0", name="ck_items_oxygen_level_non_neg"),
        # cannisters range: 0 to 4
        CheckConstraint("oxygen_cannisters BETWEEN 0 AND 4", name="ck_items_cannisters_range"),
        # Cap oxygen to 50 when at max cannisters, otherwise allow up to 100. Or maybe have it so that it stays at 100 and automatically refills when cannister goes down?
        CheckConstraint(
            """
            oxygen_level_amount <= CASE
                WHEN oxygen_cannisters = 4 THEN 50
                ELSE 100
            END
            """,
            name="ck_items_level_cap",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )

    oxygen_level_amount: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    oxygen_cannisters:   Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")

    #This bit is the one-to-one relationship
    user: Mapped["User"] = relationship(back_populates="items")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<UserItems user_id={self.user_id}>"
