from flask import Blueprint, request
from app.services.content_service import get_content_service, get_search_content_service, post_content_service  

content_bp = Blueprint('content_bp', __name__, url_prefix='/api/v1/content')

content_bp.add_url_rule('', 'get_content', get_content_service)
content_bp.add_url_rule('/search', 'get_search_content', get_search_content_service)
content_bp.add_url_rule('', 'post_content', post_content_service, methods=['POST'])