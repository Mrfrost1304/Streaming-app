from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure
from urllib.parse import urlparse
import pymongo

mongo = PyMongo()


def init_db(app):
    """
    Initialize MongoDB connection. If the configured URI does not include a
    database name (common with mongodb+srv URIs), fall back to a DB name
    provided by `MONGO_DBNAME` in app config or a sensible default.
    """
    try:
        # Initialize the PyMongo wrapper (this sets mongo.cx and possibly mongo.db)
        mongo.init_app(app)

        # If the URI had no database component, flask_pymongo leaves mongo.db as None.
        if mongo.db is None:
            # Prefer an explicit config value if provided
            dbname = app.config.get('MONGO_DBNAME')
            if not dbname:
                # Try to parse a database name from the MONGO_URI if present
                uri = app.config.get('MONGO_URI', '')
                # urlparse can't parse the DB name directly from mongodb+srv URIs,
                # so as a last resort use a default name.
                dbname = 'livestream_app'

            # assign a database object from the client
            mongo.db = mongo.cx[dbname]
            print(f"MongoDB: using fallback database '{dbname}'")

        # Test connection
        try:
            mongo.db.command('ping')
            print('MongoDB connected successfully')
        except Exception as e:
            # In some environments (CI, restricted networks) connecting to a
            # remote Atlas cluster may fail (SSL handshake, network). Don't
            # crash the whole app on startup by default — log and continue.
            print(f"Warning: MongoDB ping failed: {e}")
            if app.config.get('REQUIRE_DB_ON_STARTUP'):
                # For stricter deployments, allow opting-in to fail-fast.
                raise
    except ConnectionFailure as e:
        print(f'MongoDB connection error: {e}')
        if app.config.get('REQUIRE_DB_ON_STARTUP'):
            raise


def get_db():
    """
    Get database instance
    """
    return mongo.db