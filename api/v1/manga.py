from flask import Blueprint, g, jsonify, request
from sqlalchemy.exc import DataError

from ..decorators import load_manga, load_page_num
from ..models import Chapter, Manga, db, Tag, Author
from ..schema import chapters_schema, manga_schema, mangas_schema

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


@bp.route('', methods=('POST',))
def post_manga():
    """
    endpoint: /manga
    method: POST
    param:
      title: str
      alt_titles (opt): str
      description (opt): str
      cover: str (url)
      tags: array of int (tag id)
      authors: array of int (authors id)
    response:
      id: 1
      title: Manga Title
      alt_titles: Another Manga Title
      url: /manga/1/manga-title
      cover: cover_url
      created: 123456789
      description: manga_description
      tags:
        id: 1
        name: manga tag
        url: /tag/manga-tag
      authors:
        id: 1
        name: manga author
        url: /author/1
    error:
      400:
        code: 400
        message: No data provided
      400:
        code: 400
        message: Missing Manga title field
      400:
        desc: tags field is not an array of int or tags field contains non-existed tag id
        code: 400
        message: Invalid tags field
      400:
        desc: authors field is not an array of int or authors field contains non-existed authors id
        code: 400
        message: Invalid authors/artists field
      404:
        code: 404
        message: Not Found
    """
    data = request.get_json()
    tags_list = list()
    authors_list = list()

    if not data:
        return jsonify({
            'code': 400,
            'message': 'No data provided'
        }), 400

    if not data.get('title'):
        return jsonify({
            'code': 400,
            'message': 'Missing Manga title field'
        }), 400

    if data.get('tags'):
        invalid_tags_response = {
            'code': 400,
            'message': 'Invalid tags field'
        }
        tags = data['tags']
        if type(tags) != list:
            return jsonify(invalid_tags_response), 400
        try:
            tags_list = [Tag.query.get(tag) for tag in tags]
        except DataError:
            return jsonify(invalid_tags_response), 400
        if any(t is None for t in tags_list):
            return jsonify(invalid_tags_response), 400

    if data.get('authors'):
        invalid_authors_response = {
            'code': 400,
            'message': 'Invalid authors/artists field'
        }
        authors = data['authors']
        if type(authors) != list:
            return jsonify(invalid_authors_response), 400
        try:
            authors_list = [Author.query.get(author) for author in authors]
        except DataError:
            return jsonify(invalid_authors_response), 400
        if any(a is None for a in authors_list):
            return jsonify(invalid_authors_response), 400

    manga = Manga(
        title=data['title'],
        alt_titles=data.get('alt_titles'),
        description=data.get('description'),
        cover=data.get('cover'),
    )
    manga.tags.extend(tags_list)
    manga.authors.extend(authors_list)
    db.session.add(manga)
    db.session.commit()
    return jsonify(manga_schema.dump(manga).data), 201


@bp.route('/<int:manga_id>')
@load_manga
def get_manga(manga_id):
    """
    endpoint: /manga/<manga_id>
    method: GET
    response:
      id: 1
      title: Manga Title
      alt_titles: Another Manga Title
      url: /manga/1/manga-title
      cover: cover_url
      created: 123456789
      description: manga_description
      tags:
        id: 1
        name: manga tag
        url: /tag/manga-tag
      authors:
        id: 1
        name: manga author
        url: /author/1
    error:
      404:
        code: 404
        message: Not Found
    """
    return jsonify(manga_schema.dump(g.manga).data), 200


@bp.route('/<int:manga_id>', methods=('DELETE',))
@load_manga
def delete_manga(manga_id):
    """
    endpoint: /manga
    method: DELETE
    response:
      code: 200
      message: Deleted
    error:
      404:
        code: 404
        message: Not Found
    """
    db.session.delete(g.manga)
    db.session.commit()
    return jsonify({
        'code': 200,
        'message': 'Deleted'
    }), 200


@bp.route('/<int:manga_id>/chapters')
@load_manga
def get_chapters(manga_id):
    """
    endpoint: /manga/<manga_id>/chapters
    method: GET
    response_type: array
    response:
      manga: 1
      lists:
        id: 1
        created: 123456789
        vol: 1
        chapter: 1
        manga:
          title: manga title
          url: /manga/1/manga-title
    error:
      404:
        message: Not Found
    """
    chapters = Chapter.query.filter_by(
                manga_id=g.manga.id
               ).order_by(Chapter.chapter.desc(), Chapter.created.desc()).all()
    return jsonify(chapters_schema.dump(chapters).data)
