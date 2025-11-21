from backend import create_app
from backend.extensions import db

app = create_app()

if __name__ == "__main__":
    app.run( port=5000, debug=True)