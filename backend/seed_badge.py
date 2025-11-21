# backend/seed_badges.py
from backend import create_app
from backend.extensions import db
from backend.blueprint.models.badges import Badge

BADGES = [
    {
        "slug": "level_5",
        "name": "Level 5 Explorer",
        "description": "Reach level 5 in your Cybernaut journey.",
        "icon_filename": "level_5.png",
    },
    {
        "slug": "streak_10",
        "name": "10-Day Streak",
        "description": "Log in 10 days in a row.",
        "icon_filename": "streak_10.png",
    },
    {
        "slug": "modules_5",
        "name": "Module Grinder",
        "description": "Complete 5 learning modules.",
        "icon_filename": "modules_5.png",
    },
]

def seed_badges() -> None:
    app = create_app()
    with app.app_context():
        for data in BADGES:
            badge = Badge.query.filter_by(slug=data["slug"]).first()
            if not badge:
                badge = Badge(**data)
                db.session.add(badge)
        db.session.commit()
        print("Seeded badges ✅")

if __name__ == "__main__":
    seed_badges()
