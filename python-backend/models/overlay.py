from datetime import datetime
from bson import ObjectId
from config.dbconfig import get_db

class Overlay:
    """
    Overlay Model
    Manages text and image overlays for video streams
    """
    
    collection_name = 'overlays'
    
    @staticmethod
    def get_collection():
        db = get_db()
        return db[Overlay.collection_name]
    
    @staticmethod
    def create(data):
        """Create new overlay"""
        overlay = {
            'type': data.get('type'),
            'content': data.get('content'),
            'position': data.get('position', {'x': 50, 'y': 50}),
            'size': data.get('size', {'width': 200, 'height': 50}),
            'style': data.get('style', {
                'color': '#ffffff',
                'fontSize': 24,
                'fontWeight': 'bold',
                'backgroundColor': 'rgba(0,0,0,0.5)'
            }),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = Overlay.get_collection().insert_one(overlay)
        overlay['_id'] = result.inserted_id
        return overlay
    
    @staticmethod
    def find_all():
        """Get all overlays sorted by creation date"""
        overlays = list(Overlay.get_collection().find().sort('createdAt', -1))
        return overlays
    
    @staticmethod
    def find_by_id(overlay_id):
        """Find overlay by ID"""
        try:
            overlay = Overlay.get_collection().find_one({'_id': ObjectId(overlay_id)})
            return overlay
        except Exception:
            return None
    
    @staticmethod
    def update(overlay_id, data):
        """Update overlay"""
        try:
            update_data = {'updatedAt': datetime.utcnow()}
            
            if 'type' in data:
                update_data['type'] = data['type']
            if 'content' in data:
                update_data['content'] = data['content']
            if 'position' in data:
                update_data['position'] = data['position']
            if 'size' in data:
                update_data['size'] = data['size']
            if 'style' in data:
                update_data['style'] = data['style']
            
            result = Overlay.get_collection().find_one_and_update(
                {'_id': ObjectId(overlay_id)},
                {'$set': update_data},
                return_document=True
            )
            
            return result
        except Exception:
            return None
    
    @staticmethod
    def delete(overlay_id):
        """Delete overlay"""
        try:
            overlay = Overlay.get_collection().find_one_and_delete({'_id': ObjectId(overlay_id)})
            return overlay
        except Exception:
            return None
    
    @staticmethod
    def serialize(overlay):
        """Convert ObjectId to string for JSON serialization"""
        if overlay:
            overlay['_id'] = str(overlay['_id'])
            if 'createdAt' in overlay:
                overlay['createdAt'] = overlay['createdAt'].isoformat()
            if 'updatedAt' in overlay:
                overlay['updatedAt'] = overlay['updatedAt'].isoformat()
        return overlay