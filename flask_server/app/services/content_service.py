from flask import jsonify, request
import re
from flask_jwt_extended import jwt_required
from app.models.content import content_collection   
from app.utils.helpers import convert_object_ids

"""
Get all content
Method: GET
Route: /api/v1/content
Access: Public
"""
def get_content_service():
    try:
        content = list(content_collection.find())
        serialized_content = convert_object_ids(content)
        return jsonify(serialized_content)
    except Exception as e:
        return jsonify(str(e)), 500
    
"""
Get content by title
Method: GET
Route: /api/v1/content/search
Query params : title | tags
Access: Public
"""
def get_search_content_service():
    try:
        title = request.args.get('title')
        if title:
            regex = re.compile(title, re.IGNORECASE)  # equivalent to /title/i in JS
            query = {'title': regex}
            content = list(content_collection.find(query))
            serialized_content = convert_object_ids(content)
            return jsonify(serialized_content)
    except Exception as e:
        return jsonify(str(e)), 500

"""
Post content
Method: POST
Route: /api/v1/content
Reqbody: title & content & tags
Access: Private
"""
@jwt_required()       
def post_content_service():
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        tags = data.get('tags')
        if not title or not content or not tags:
            return jsonify('insufficient data'), 400
        new_document = {
            'title': title,
            'content': content,
            'tags': tags,
        }
        content_collection.insert_one(new_document)
        return jsonify('content created successfully'), 201
    except Exception as e:
        return {'error':str(e)}, 500