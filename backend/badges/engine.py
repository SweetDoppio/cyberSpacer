# backend/badges/engine.py

from __future__ import annotations

from backend.extensions import db
from backend.blueprint.models import User, Badge


BADGE_SLUGS = ["level_5", "streak_10", "modules_5"]


def evaluate_badges_for_user(user: User) -> list[Badge]:
    """Check badge rules for this user, award any new ones, and return them."""

    stats = user.stats
    if stats is None:
        return []

    badges = {
        b.slug: b
        for b in Badge.query.filter(Badge.slug.in_(BADGE_SLUGS)).all()
    }

    newly_awarded: list[Badge] = []

    def maybe_award(slug: str, condition: bool) -> None:
        badge = badges.get(slug)
        if not badge or not condition:
            return
        if not user.has_badge(slug):
            user.award_badge(badge)
            newly_awarded.append(badge)

    # --- Rules ---

    # Level 5
    maybe_award("level_5", stats.current_level >= 5)

    # 10-day login streak
    maybe_award("streak_10", stats.days_logged_in >= 10)

    maybe_award("modules_5", stats.modules_completed >= 5)

    if newly_awarded:
        db.session.add(user)
        db.session.commit()

    return newly_awarded
