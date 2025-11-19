"""backfill stats/items for existing users

Revision ID: c182549c4320
Revises: 44e080bedc4b
Create Date: 2025-10-22 21:06:32.013773
"""
from alembic import op
import sqlalchemy as sa

# --- revision identifiers ---
revision = "c182549c4320"
down_revision = "44e080bedc4b"
branch_labels = None
depends_on = None


def upgrade():
    # Backfill user_stats using ONLY the columns that exist in your table
    # (id is SERIAL PK; we don't set it. last_login_date is nullable; set NULL.)
    op.execute(
        """
        INSERT INTO user_stats (
            user_id,
            days_logged_in,
            quizzes_completed,
            current_level,
            modules_completed,
            total_xp,
            xp_in_level,
            xp_to_next,
            last_login_date
        )
        SELECT
            u.id,   -- user_id
            0,      -- days_logged_in (NOT NULL, >= 0)
            0,      -- quizzes_completed (NOT NULL, >= 0)
            1,      -- current_level (NOT NULL, >= 1)
            0,      -- modules_completed (NOT NULL, >= 0)
            0,      -- total_xp (NOT NULL, >= 0)
            0,      -- xp_in_level (NOT NULL, >= 0)
            1,      -- xp_to_next (NOT NULL, > 0)  <-- IMPORTANT: must be > 0
            NULL    -- last_login_date (nullable)
        FROM users u
        WHERE NOT EXISTS (
            SELECT 1 FROM user_stats s WHERE s.user_id = u.id
        )
            ON CONFLICT DO NOTHING;
        """
    )

    # Backfill user_items as well (adjust names if your table differs)
    op.execute(
        """
        INSERT INTO user_items (
            user_id,
            oxygen_level_amount,
            oxygen_cannisters
        )
        SELECT
            u.id,
            0,  -- oxygen_level_amount
            0   -- oxygen_cannisters
        FROM users u
        WHERE NOT EXISTS (
            SELECT 1 FROM user_items i WHERE i.user_id = u.id
        )
            ON CONFLICT DO NOTHING;
        """
    )


def downgrade():
    # Remove only the backfilled rows
    op.execute("DELETE FROM user_items WHERE user_id IN (SELECT id FROM users);")
    op.execute("DELETE FROM user_stats WHERE user_id IN (SELECT id FROM users);")
