from flask import Blueprint, g, jsonify, request
from sqlalchemy import and_, func, text

from ..decorators import load_page_num, require_token
from ..models import Chapter, Manga, UsersManga, db
from ..schema import chapters_schema, mangas_schema

bp = Blueprint('release', __name__)


@bp.route('/chapters')
@load_page_num
def get_chapters():
    """
    endpoint: /release/chapters
    method: GET
    param:
      page (opt): int - default 1
      total (opt): int - default 10
    response_type: array
    response:
      id: 1
      created: 123456789
      vol: 1
      chapter: 1
      title: Chapter titles
      url: /chapter/1
      manga:
        title: manga title
        url: /manga/1/manga-title
        cover: manga_cover_url
    error:
      404:
        code: 404
        message: Not Found
    """
    data = request.get_json()
    per_page = data.get('perPage', 10) if data else 10   # avoid empty json
    chapters = Chapter.query.order_by(
                Chapter.created.desc(),
                Chapter.chapter.desc()
              ).paginate(
                  page=g.page,
                  per_page=per_page,
                  error_out=False,
              )
    if not chapters.items:
        return jsonify({
            'code': 404,
            'message': 'Not Found'
        }), 404

    return jsonify(chapters_schema.dump(chapters.items).data)


@bp.route('/following')
@require_token
def get_following():
    """
    endpoint: /release/following
    method: GET
    param:
      "[header: Authorization] Token": str - Token received from firebase
    response_type: array
    response:
      id: 1
      created: 123456789
      vol: 1
      chapter: 1
      title: Chapter titles
      url: /chapter/1
      manga:
        title: manga title
        url: /manga/1/manga-title
        cover: manga_cover_url
    error:
      404:
        code: 404
        message: There are no new chapters available
    """
    list_manga = UsersManga.query.filter(and_(
        UsersManga.user_uid.like(g.uid),
        UsersManga.subscribed.is_(True),
    )).all()

    list_manga_id = [x.mangas.id for x in list_manga]
    chapters = Chapter.query.filter(
                    Chapter.manga_id.in_(list_manga_id)
               ).order_by(
                    Chapter.created.desc()
               ).group_by(Chapter.manga_id).all()
    if not chapters:
        return jsonify({
            'code': 404,
            'message': 'There are no new chapters available'
        })
    return jsonify(chapters_schema.dump(chapters).data)


@bp.route('/manga')
def get_manga():
    """
    endpoint: /release/manga
    method: GET
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
    """
    manga = Manga.query.order_by(Manga.created.desc()).limit(5).all()
    return jsonify(mangas_schema.dump(manga).data)


@bp.route('/popular')
def get_popular_manga():
    """
    endpoint: /release/popular
    method: GET
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
    """
    manga = db.session.query(
                UsersManga,
                func.count(UsersManga.manga_id).label('total')
            ).group_by(UsersManga.manga_id).order_by(text('total DESC')).limit(5).all()
    return jsonify(mangas_schema.dump(manga).data)
