from functools import wraps

from firebase_admin import auth
from flask import g, jsonify, request

from .models import Manga
from .utils.token import firebase_init


def load_page_num(f):
    """
    Load page from json request data into g.page

    Raise 400 Invalid page number value if page is not valid int
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        data = request.get_json()
        page = None

        # in case request has body
        if data:
            page = data.get('page')

        if not page:
            page = 1

        try:
            if int(page) != page:
                raise ValueError

            g.page = page
        except ValueError:
            return jsonify({
                'code': 400,
                'message': 'Invalid page number value'
            }), 400

        return f(*args, **kwargs)
    return wrapper


def load_manga(f):
    """ Load manga object by query manga_id into g.manga
    """
    @wraps(f)
    def wrapper(manga_id, *args, **kwargs):
        manga = Manga.query.get(manga_id)
        if not manga:
            return jsonify({
                'code': 404,
                'message': 'Not Found'
            }), 404

        g.manga = manga
        return f(manga_id, *args, **kwargs)

    return wrapper


def require_json(f):
    """
    Force request header must have content-type application/json and request
    body must not be empty json
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not request.is_json:
            return 'Bad request', 400

        if not request.get_json():
            return jsonify({
                'code': 400,
                'message': 'No data provided'
            })
        return f(*args, **kwargs)
    return wrapper


def load_token(f):
    """
    Load uid into g.uid by decoding token if it is present in headers
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        firebase_init()
        token = request.headers.get('Authorization')
        try:
            g.uid = auth.verify_id_token(token)
        except ValueError:
            pass

        return f(*args, **kwargs)
    return wrapper


def require_token(f):
    """
    Load uid into g.uid by decoding token. Raise 400 Bad Request if token is missing
    or invalid
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        firebase_init()
        token = request.headers.get('Authorization')
        try:
            g.uid = auth.verify_id_token(token)
        except ValueError:
            return jsonify({
                'code': 400,
                'message': 'Token is missing or invalid'
            }), 400

        return f(*args, **kwargs)
    return wrapper
