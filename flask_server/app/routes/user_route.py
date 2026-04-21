from flask import Blueprint
from flask_restful import Api
from app.services.user_service import UserRegistration, UserLogin, UserDetails

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/v1/user')

api = Api(user_bp)

api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(UserDetails, '/details')