import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import firebase_admin
    from firebase_admin import credentials, db
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

from engine import MultiversalEngine

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

class SearchRequest(BaseModel):
    query: str
    user_context: dict = {"category": "bedroom"}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def resolve_service_account_path():
    env_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    search_paths = []
    if env_path:
        search_paths.append(env_path)

    base_dir = os.path.dirname(__file__)
    search_paths.extend([
        os.path.join(base_dir, 'serviceAccountKey.json'),
        os.path.normpath(os.path.join(base_dir, '..', 'server', 'config', 'serviceAccountKey.json')),
        os.path.normpath(os.path.join(base_dir, '..', 'server', 'aaramdehi-91f82-firebase-adminsdk-fbsvc-a144c1cbb1.json')),
    ])

    for candidate in search_paths:
        if candidate and os.path.exists(candidate):
            logger.info('Found Firebase credential file at %s', candidate)
            return candidate

    if env_path:
        logger.warning('GOOGLE_APPLICATION_CREDENTIALS=%s was set but the file was not found.', env_path)
    return None


def init_firebase():
    if not FIREBASE_AVAILABLE:
        logger.warning('firebase-admin is not installed; Firestore support is disabled.')
        return None

    cred_path = resolve_service_account_path()
    if not cred_path:
        logger.warning('Firebase service account key not found; using fallback catalog.')
        return None

    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        # ✅ Correctly initialize Realtime Database with its URL
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://aaramdehi-91f82-default-rtdb.firebaseio.com/'
        })
        logger.info('Initialized Firebase Admin SDK using %s', cred_path)

    return True


def load_catalog_from_rtdb():
    if not FIREBASE_AVAILABLE:
        logger.info('Firebase SDK not available; falling back to static catalog.')
        return []

    catalog = []
    try:
        # ✅ Use Realtime Database references instead of Firestore collections
        products_ref = db.reference('products')
        products_data = products_ref.get()
        
        if products_data:
            for key, data in products_data.items():
                catalog.append({
                    'title': data.get('name') or data.get('title') or 'Untitled Product',
                    'category': data.get('category', 'uncategorized'),
                    'is_essential': bool(data.get('is_essential', False)),
                    'id': key,
                    'thumbnail': data.get('thumbnail'),
                    'sellingPrice': data.get('sellingPrice') or data.get('price', 0)
                })

        logger.info('Loaded %d product(s) from Realtime Database.', len(catalog))
    except Exception as exc:
        logger.warning(
            'Failed to load Realtime Database catalog: %s. Falling back to static catalog.',
            exc,
        )
        return []

    return catalog


init_firebase()
firestore_catalog = load_catalog_from_rtdb()

fallback_catalog = [
    {'title': 'Night Lamp', 'category': 'bedroom', 'is_essential': True},
    {'title': 'Study Table', 'category': 'office', 'is_essential': False},
]

catalog = firestore_catalog or fallback_catalog
engine = MultiversalEngine(catalog)

@app.post("/search")
def search_api(request: SearchRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail='Query must not be empty.')
    
    # ✅ Convert dict to tuple for caching compatibility
    context_tuple = tuple(sorted(request.user_context.items()))
    return engine.search(request.query, context_tuple)

@app.get("/search")
def search_get(q: str, cat: str = "bedroom"):
    context_tuple = (("category", cat),)
    return engine.search(q, context_tuple)
