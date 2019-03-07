from flask import Blueprint, jsonify, request

from ..models import User
from ..schema import user_schema

bp = Blueprint('user', __name__)


@bp.route('')
def index():
    """
    endpoint: /user
    method: GET
    param:
      uid: string
    response:
      uid: abcdefgh-abcd-abcd-abcd-abcdefgh
      username: user
      avatar: user_avatar
      mangas:
        id: 1
        title: Manga Title
        alt_titles: Another Manga Title
        url: /manga/1/manga-title
        cover: cover_url
        description: Manga descriptions
    error:
      404:
        code: 404
        message: Not Found
    """
    data = request.get_json()
    user = User.query.get(data['id'])
    if not user:
        return jsonify({
            'code': 404,
            'message': 'Not Found'
        }), 404
    return jsonify(user_schema.dump(user).data)
