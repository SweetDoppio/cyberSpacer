from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv, find_dotenv
from backend.extensions import db, migrate
load_dotenv(find_dotenv())


def create_app():
    print("DATABASE_URL =", os.getenv("DATABASE_URL"))

    app = Flask(__name__)
#specifying the location of the sql database on local machine
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-only-change-me")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    db.init_app(app)
    migrate.init_app(app,db)

    import backend.blueprint.models

    from backend.blueprint.models.user import User  # add any other models

    #blueprint Routes
    #WHy is this shit so confusing.
    from backend.blueprint.auth import auth_bp
    from backend.blueprint.user_dashboard_group.routes import user_dashboard_group_bp
    app.register_blueprint(auth_bp, url_prefix="/api/users")
    app.register_blueprint(user_dashboard_group_bp, url_prefix="/api/user_dashboard_group")

    return app
