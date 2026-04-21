from flask import jsonify
from app.models.tags import tags_collection
from app.utils.helpers import convert_object_ids

"""
Get all tags
Method: GET
Route: /api/v1/tags
Access: Public
"""
def get_tags_service():
    try:
        tags_doc = tags_collection.find_one({}, {'_id': 0})
        if tags_doc and 'tags' in tags_doc:
            return jsonify(tags_doc['tags'])
        return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500