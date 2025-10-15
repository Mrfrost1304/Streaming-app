from datetime import datetime
from bson import ObjectId
from config.dbconfig import get_db

class Settings:
    """
    Settings Model
    Manages application settings like RTSP URL, stream quality, etc.
    """
    
    collection_name = 'settings'
    
    @staticmethod
    def get_collection():
        db = get_db()
        return db[Settings.collection_name]
    
    @staticmethod
    def get_settings():
        """Get application settings (singleton pattern)"""
        settings = Settings.get_collection().find_one()
        
        # Create default settings if none exist
        if not settings:
            settings = {
                'rtspUrl': '',
                'streamQuality': 'high',
                'bufferSize': 1024,
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }
            result = Settings.get_collection().insert_one(settings)
            settings['_id'] = result.inserted_id
        
        return settings
    
    @staticmethod
    def update_settings(data):
        """Update application settings"""
        settings = Settings.get_collection().find_one()
        
        if not settings:
            # Create new settings
            settings = {
                'rtspUrl': data.get('rtspUrl', ''),
                'streamQuality': data.get('streamQuality', 'high'),
                'bufferSize': data.get('bufferSize', 1024),
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }
            result = Settings.get_collection().insert_one(settings)
            settings['_id'] = result.inserted_id
        else:
            # Update existing settings
            update_data = {'updatedAt': datetime.utcnow()}
            
            if 'rtspUrl' in data:
                update_data['rtspUrl'] = data['rtspUrl']
            if 'streamQuality' in data:
                update_data['streamQuality'] = data['streamQuality']
            if 'bufferSize' in data:
                update_data['bufferSize'] = data['bufferSize']
            
            settings = Settings.get_collection().find_one_and_update(
                {'_id': settings['_id']},
                {'$set': update_data},
                return_document=True
            )
        
        return settings
    
    @staticmethod
    def serialize(settings):
        """Convert ObjectId to string for JSON serialization"""
        if settings:
            settings['_id'] = str(settings['_id'])
            if 'createdAt' in settings:
                settings['createdAt'] = settings['createdAt'].isoformat()
            if 'updatedAt' in settings:
                settings['updatedAt'] = settings['updatedAt'].isoformat()
        return settings