from functools import wraps

from flask import g, request, jsonify

from .models import Manga


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
