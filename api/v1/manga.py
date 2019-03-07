from flask import Blueprint, jsonify, request

from ..models import Manga
from ..schema import manga_schema

bp = Blueprint('manga', __name__)


@bp.route('')
def index():
    """
    endpoint: /manga
    method: GET
    param:
      id: int
    response:
      id: 1
      title: Manga Title
      alt_titles: Another Manga Title
      url: /manga/1/manga-title
      cover: cover_url
      description: Manga descriptions
      tags:
        id: 1
        name: tag_name
        url: /tag/tag_name
      authors:
        id: 1
        name: author_name
        url: /author/author_name
    error:
      404:
        code: 404
        message: Not Found
    """
    data = request.get_json()
    manga = Manga.query.get(data['uid'])
    if not manga:
        return jsonify({
            'code': 404,
            'message': 'Not Found'
        }), 404
    return jsonify(manga_schema.dump(manga).data)
