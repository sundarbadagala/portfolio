from flask import Flask
from flask_jwt_extended import JWTManager
from app.config import Config
from .routes import register_routes
from app.utils.helpers import after_api_request

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    jwt.init_app(app)
    
    after_api_request(app)

    register_routes(app)
    
    return app