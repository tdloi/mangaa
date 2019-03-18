from functools import wraps

import firebase_admin
from firebase_admin import auth, credentials
from flask import g, jsonify, request

from .models import Manga, User, db


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
    Load uid into g.uid by decoding token if it is present in headers. Create new
    User record if uid does not exist in database
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate('data/serviceAccountKey.json')
            default_app = firebase_admin.initialize_app(cred)
        token = request.headers.get('Authorization')
        try:
            encoded_token = auth.verify_id_token(token)
            g.uid = encoded_token['uid']
            if not User.query.get(g.uid):
                db.session.add(User(uid=g.uid))
                db.session.commit()
                db.session.remove()
        except ValueError:
            pass

        return f(*args, **kwargs)
    return wrapper


def require_token(f):
    """
    Load uid into g.uid by decoding token. Create new User record if uid does not
    exist in database. Raise 400 Bad Request if token is missing
    or invalid
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate('data/serviceAccountKey.json')
            default_app = firebase_admin.initialize_app(cred)
        token = request.headers.get('Authorization')
        try:
            encoded_token = auth.verify_id_token(token)
            g.uid = encoded_token['uid']
            if not User.query.get(g.uid):
                db.session.add(User(uid=g.uid))
                db.session.commit()
                db.session.remove()
        except ValueError:
            # TODO: Return JSON error
            return '', 400

        return f(*args, **kwargs)
    return wrapper
