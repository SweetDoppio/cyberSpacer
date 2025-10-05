from flask_wtf import FlaskForm
from wtforms import EmailField, PasswordField
from wtforms.fields.numeric import IntegerField
from wtforms.fields.simple import SubmitField, StringField
from wtforms.validators import DataRequired, Email, EqualTo
import sqlalchemy as sa
from backend import db
from backend.blueprint.models.students import User


class LoginForm(FlaskForm):
    email = EmailField("email", validators=[DataRequired('Email required to log in')])
    password = PasswordField("password", validators=[DataRequired('Password required')])
    submit = SubmitField('Sign in')

class RegisterForm(FlaskForm):
    first_name = StringField("first name", validators=[DataRequired('Please enter your first name')])
    last_name = StringField('last name', validators=[DataRequired('Please enter your last name')])
    age = IntegerField('age', validators=[DataRequired('Age is required!')])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Enter user Password', validators=[DataRequired()])
    password_confirm =PasswordField('Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

    def user_validation(self, email):
        email = db.session.scalar(sa.Select(User).where(User.email == email.data))


