from backend.extensions import db
from typing import Optional, cast
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import String, Boolean, Integer, ForeignKey
from flask_login import UserMixin
from typing import TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .stats import UserStats
    from .items import UserItems
    from .badges import Badge

class User(db.Model, UserMixin):

    #PGadmin is gonna reference tablename not the class name
    #For testing name = 'cybernaut' password = 'password123' email = 'cybernaut@gmail.com'
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}


    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), index=True, nullable=False, unique=False)
    last_name: Mapped[str] = mapped_column(String(50), index=True, nullable=False, unique=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now() )
    email: Mapped[str] = mapped_column(String(100), index=True, nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(256), index=False, nullable=False)
    avatar_url = db.Column(db.String(255), nullable=True)

# onne to one relational orm
    stats: Mapped["UserStats"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    items: Mapped["UserItems"] = relationship(back_populates="user",uselist=False, cascade="all ,delete-orphan")

    # many2many relational orrm
    badges: Mapped[list["Badge"]] = relationship(
        secondary="user_badges", back_populates="users", lazy="selectin"
    )

    @validates("first_name", "last_name")
    def set_name_to_lower_case(self,_key:str, value: str) -> str:
        return value.strip().lower()

    @validates("email")
    def set_email_to_lower_case(self,_key:str, value: str) -> str:
        return (value or "").strip().lower()

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password,method='scrypt' ,salt_length=30)

    def verify_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        gofakk = cast(str, cast(object, self.password_hash))
        return check_password_hash(gofakk, password)

    def has_badge(self, slug: str) -> bool:
        return any(b.slug == slug for b in self.badges)

    def award_badge(self, badge: "Badge") -> None:
        # Tell the type checker “trust me, this is a str”
        self_slug = cast(str, cast(object, badge.slug))
        if not self.has_badge(self_slug):
            self.badges.append(badge)

    def get_user_credentials_dict_public(self) -> dict:
        return {
            "id" : self.id,
            "first_name" : self.first_name,
            "age" : self.age,
            "email" : self.email,
            "avatar_url" : self.avatar_url
        }

    def get_user_credentials_dict(self) -> dict:
        return {
            "id" : self.id,
            "firstName" : self.first_name,
            "lastName" : self.last_name,
            "age" : self.age,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "email" : self.email,
        }

    def __init__(self, first_name='Anon', last_name='who', email=None,age=None, password=None, **kwargs):
        super().__init__(**kwargs)
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.age = age

        if password:
            self.set_password(password)

    def __repr__(self):
        return f"{self.first_name}, {self.last_name}, {self.email}"
