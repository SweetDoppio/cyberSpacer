import math
from typing import Any, TYPE_CHECKING

from sqlalchemy import Integer, CheckConstraint, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm.attributes import InstrumentedAttribute
from typing import cast
from backend.extensions import db
from datetime import datetime, timezone, date
from sqlalchemy import Index

if TYPE_CHECKING:
    from .user import User

BASE_REQ = 83
GROWTH   = 1.8

class UserStats(db.Model):
    __tablename__ = "user_stats"
    __table_args__ = (
        CheckConstraint("days_logged_in >= 0",name="ck_stats_days_logged_in_non_neg"),
        CheckConstraint("quizzes_completed >= 0",name="ck_stats_quizzes_non_neg"),
        CheckConstraint("current_level >= 1",name="ck_stats_current_level_min1"),
        #Not sure if wer have time to fully implement module based learning, uh oh.
        CheckConstraint("total_xp >= 0",name="ck_stats_total_xp_non_neg"),
        CheckConstraint("modules_completed >= 0", name="ck_stats_modules_non_neg", ),
        CheckConstraint("xp_in_level >= 0", name="ck_stats_xp_in_level_non_neg"),
        CheckConstraint("xp_to_next > 0", name="ck_stats_xp_to_next_pos"),
        Index("ix_user_stats_total_xp", "total_xp")
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)

    #checking streeeeeaks
    days_logged_in:   Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_login_date:   Mapped[date | None] = mapped_column(Date, nullable=True)

    #Progresses
    quizzes_completed:Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_level:    Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    modules_completed:Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # XP
    total_xp:    Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    xp_in_level: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    xp_to_next:  Mapped[int] = mapped_column(Integer, default=83, nullable=False)

    user: Mapped["User"] = relationship(back_populates="stats")


    def to_dict(self) -> dict:
        return {
            "days_logged_in": self.days_logged_in,
            "last_login_date": self.last_login_date.isoformat() if self.last_login_date else None,
            "current_level": self.current_level,
            "total_xp": self.total_xp,
            "xp_in_level": self.xp_in_level,
            "xp_to_next": self.xp_to_next,
            "quizzes_completed": self.quizzes_completed,
            "modules_completed": self.modules_completed,
        }

    def apply_login_streak(self) -> None:
        today = datetime.now(timezone.utc).date()
        if self.last_login_date is None:
            self.days_logged_in = 1
        else:
            better_login_mate= (today - self.last_login_date).days
            if  better_login_mate == 1:
                self.days_logged_in += 1
            elif  better_login_mate > 1:
                self.days_logged_in = 1
            # delta == 0 -> same day, no change
        self.last_login_date = today



    def _compute_level_from_total(self) -> tuple[int,int,int]:

        level: int = 1
        req: int = int(BASE_REQ)
        remaining = int(self.total_xp or 0)

        while remaining >= req:
            remaining -= req
            level += 1
            req = math.floor(req * GROWTH)

        return level, remaining, req

    def recompute_level_fields(self) -> None:
        lvl, in_lvl, to_next = self._compute_level_from_total()
        self.current_level = max(1, lvl)
        self.xp_in_level = in_lvl
        self.xp_to_next = max(1, to_next)

    def earn_xp(self, amount: int) -> None:
        """Award XP and update derived fields."""
        if amount <= 0:
            return
        self.total_xp += amount
        self.recompute_level_fields()

    def __repr__(self) -> str:
        return f"<UserStats user_id={self.user_id}>"