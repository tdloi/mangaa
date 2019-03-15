from flask import Blueprint, jsonify, request, g

from ..models import Manga
from ..schema import mangas_schema
from ..decorators import load_page_num

bp = Blueprint('manga', __name__)


@bp.route('')
@load_page_num
def index():
    """
    endpoint: /manga
    method: GET
    description: |
      Return a list of manga, if page is not specified or negetive, return first page,
      if page is bigger than total page, return 404,
      if page is cannot convert to int, return 400
    param:
      page (optional): int
    response:
      page: 1
      nextPage: 2
      prevPage: null
      totalPage: 3
      results:
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
      400:
        code: 400
        message: Invalid page number values
      404:
        code: 404
        message: Not Found
    """
    manga = Manga.query.paginate(
        page=g.page,
        per_page=20,
        error_out=False
    )
    if not manga.items:
        return jsonify({
            'code': 404,
            'message': 'Not Found'
        }), 404

    response = {
        'page': manga.page,
        'nextPage': manga.next_num,
        'prevPage': manga.prev_num,
        'totalPage': manga.pages,
        'results': mangas_schema.dump(manga.items).data,
    }
    return jsonify(response)
