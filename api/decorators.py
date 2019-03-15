from functools import wraps

from flask import g, request, jsonify


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
