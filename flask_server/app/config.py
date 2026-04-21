import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    PORT = int(os.getenv('PORT', 7070))
    MONGO_URI = os.getenv('MONGO_URI')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-jwt-secret')
