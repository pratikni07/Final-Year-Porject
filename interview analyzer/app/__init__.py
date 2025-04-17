from flask import Flask
from flask_cors import CORS
from config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    from app.routes import main
    app.register_blueprint(main)

    return app