from db import db

client = db()

if not client:
    raise Exception("Failed to connect to database")

db = client['test']
user_collection = db['user-data']