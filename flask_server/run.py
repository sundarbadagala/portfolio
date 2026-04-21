from app import create_app
from db import db

app = create_app()

db()

if __name__ == '__main__':
    app.run(
        debug = app.config['DEBUG'],
        port = app.config.get('PORT', 5000)
    )