from .user_route import user_bp
from .content_route import content_bp
from .tags_route import tags_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(content_bp)
    app.register_blueprint(tags_bp)