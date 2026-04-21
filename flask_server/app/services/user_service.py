import bcrypt
from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.utils.helpers import convert_object_ids
from app.models.user import user_collection
    
"""
Login user
Method: POST
Route: /api/v1/user/login
Reqbody: email && password
Access: Public
"""
class UserLogin(Resource):
    def post(self):
        try:
            data = request.get_json()
            email =data.get('email')
            password = data.get('password')
            if not email or not password:
                return 'data missing', 400
            user = user_collection.find_one({'email':email})
            if not user:
                return 'user not found', 404
            hashed_password = user.get('password')
            if not bcrypt.checkpw(password.encode('utf-8'),  hashed_password.encode('utf-8')):
                return "invalid password", 401
            access_token = create_access_token(identity=email)
            return access_token, 200
        except Exception as e:
            return str(e), 500

"""
Register new user
Method: POST
Route: /api/v1/user/register
Reqbody: email && username && password && confirm_password
Access: Public
"""
class UserRegistration(Resource):
    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            username = data.get('username')
            password = data.get('password')
            
            if not email or not username or not password:
                return 'data missing', 400
            
            if user_collection.find_one({'email': email}):
                return 'user already exists', 400
            
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            new_user = {
                'email': email,
                'username': username,
                'password': hashed_password
            }
            
            user_collection.insert_one(new_user)
            return 'success', 201
        except Exception as e:
            return str(e), 500
    
"""
Get user details
Method: GET
Route: /api/v1/user/details
Access: Private
"""  
class UserDetails(Resource):
    @jwt_required()
    def get(self):
        try:
            user_email = get_jwt_identity()
            
            if not user_email:
                return jsonify('Invalid token or missing identidy'), 401
            user = user_collection.find_one({'email': user_email})
            if not user:
                return jsonify("user not found"), 404
            serialized_user = convert_object_ids(user)
            # Don't return the hashed password
            if 'password' in serialized_user:
                del serialized_user['password']
            return jsonify(serialized_user), 200
        except Exception as e:
            return str(e), 500