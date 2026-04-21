from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app.config import Config

_client = None

def db():
    global _client
    if _client is None:
        try:
            _client = MongoClient(
                Config.MONGO_URI,
                serverSelectionTimeoutMS=5000
            )
            _client.admin.command("ping")
            print("✅ Connected to MongoDB")
        except ConnectionFailure:
            print("❌ Could not connect to MongoDB")
            _client = None
    return _client

