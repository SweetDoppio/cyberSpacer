from flask import Flask,jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv, find_dotenv
from backend.extensions import db, migrate
load_dotenv(find_dotenv()) #Place this in create_app when running on my PC
from flask_login import LoginManager
login_manager = LoginManager()
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
    login_manager.init_app(app)

    @login_manager.unauthorized_handler
    def _unauthorized():
        return jsonify({"error": "login required"}), 401
    login_manager.login_view = None

    @login_manager.unauthorized_handler
    def _unauthorized():
        return jsonify({"error": "login required"}), 401
    import backend.blueprint.models

    from backend.blueprint.models.user import User

    #blueprint Routes
    #WHy is this shit so confusing.
    from backend.blueprint.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    #Dont think I'll be using this
    # from backend.blueprint.user_items.routes import user_dashboard_group_bp
    # app.register_blueprint(user_dashboard_group_bp, url_prefix="/api/user_dashboard_group")

    from backend.blueprint.user_dashboard import stats_bp
    app.register_blueprint(stats_bp, url_prefix="/api/user_dashboard")

    from backend.blueprint.user_items import user_items_bp
    app.register_blueprint(user_items_bp, url_prefix="/api/user_items")

    from backend.blueprint.quiz import quiz_bp
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")


    return app

@login_manager.user_loader
def load_user(user_id: str):
    from backend.blueprint.models import User
    return db.session.get(User, int(user_id))

