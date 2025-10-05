from backend import db
from typing import Optional, cast
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.orm import Mapped, mapped_column, relationship, declarative_base, validates
from sqlalchemy import String, Boolean, Integer, ForeignKey
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = "user_account"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    age: Mapped[int] = mapped_column(Integer, index=True)
    email: Mapped[str] = mapped_column(String(100), index=True, nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(256), index=False, nullable=False)
    @validates("first_name", "last_name")
    def set_name_to_lower_case(self, value: str) -> str:
        return value.strip().lower()

    @validates("email")
    def set_email_to_lower_case(self, value: str) -> str:
        return value.strip().lower()

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password, salt_length=30)

    def verify_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        gofakk = cast(str, cast(object, self.password_hash))
        return check_password_hash(gofakk, password)

    def __init__(self, first_name='Anon', last_name='who', email=None, password_hash=None, age=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.age = age
        if password_hash:
            self.password = password_hash

    def __repr__(self):
        return f"{self.first_name}, {self.last_name}, {self.email}"
