from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_login import UserMixin, AnonymousUserMixin


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./cyberdb.db'
    app.config.from_prefixed_env()  # reads FLASK_* env vars if you want
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    db.init_app(app)
    app.config['SECRET_KEY'] = "I'll never tell"

    migrate = Migrate(db.app)
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app
