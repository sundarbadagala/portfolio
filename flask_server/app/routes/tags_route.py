from flask import Blueprint
from app.services.tags_service import get_tags_service

tags_bp = Blueprint('tags_bp', __name__, url_prefix='/api/v1/tags')

@tags_bp.route('', methods=['GET'])
def get_tags():
    return get_tags_service()
    