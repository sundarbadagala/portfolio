from bson import ObjectId
from flask import json

def convert_object_ids(obj):
    if isinstance(obj, dict):
        return {k: convert_object_ids(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_object_ids(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

def after_api_request(app):
    @app.after_request
    def after_request(response):
        # Only wrap if content_type is application/json
        if response.content_type == 'application/json':
            try:
                response_data = response.get_json()
                
                # Avoid double wrapping if already wrapped
                if isinstance(response_data, dict) and ('status' in response_data and ('data' in response_data or 'message' in response_data)):
                    return response
                
                status_code = response.status_code
                if 200 <= status_code < 300:
                    wrapped = {
                        'status': 'success',
                        'message': "",
                        'data': response_data
                    }
                else:
                    wrapped = {
                        'status': 'error',
                        'data': None,
                        'message': response_data if isinstance(response_data, str) else "Something went wrong",
                    }
                    if isinstance(response_data, dict) and 'message' in response_data:
                        wrapped['message'] = response_data['message']
                
                response.set_data(json.dumps(wrapped))
            except Exception as e:
                # If JSON parsing fails, just return the original response
                app.logger.error(f"Error in after_request wrapper: {e}")
                pass
        return response