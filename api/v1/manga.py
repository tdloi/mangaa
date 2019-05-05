import os
from os.path import splitext

from flask import Blueprint, current_app, g, jsonify, request
from sqlalchemy.exc import DataError

from ..decorators import load_manga, load_page_num, load_token, require_token
from ..models import Author, Chapter, Comment, Images, Manga, Tag, User, UsersManga, db
from ..schema import chapters_schema, comment_schema, comments_schema, manga_schema, mangas_schema
from ..tasks import upload_webp
from ..utils.helpers import generate_expires_field, rand_str, s3_bucket

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
      tags: a string of tag id seperated by a comma
      authors: a string of author id seperated by a comma
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
        message: Missing Manga title field
      400:
        desc: tags field contains non-existed tag id
        code: 400
        message: Invalid tags field
      400:
        desc: authors field contains non-existed authors id
        code: 400
        message: Invalid authors/artists field
      400:
        code: 400
        message: Missing authors field
      400:
        desc: Uploaded cover is not in list allowed extension file
        code: 400
        message: Unsupported format type
      404:
        code: 404
        message: Not Found
    """
    data = request.form
    tags_list = list()
    authors_list = list()

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
        tags = data['tags'].split(',')
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
        authors = data['authors'].split(',')
        try:
            authors_list = [Author.query.get(author) for author in authors]
        except DataError:
            return jsonify(invalid_authors_response), 400
        if any(a is None for a in authors_list):
            return jsonify(invalid_authors_response), 400
    else:
        return jsonify({
            'code': 400,
            'message': 'Missing authors field'
        }), 400

    manga = Manga(
        title=data['title'],
        alt_titles=data.get('alt_titles'),
        description=data.get('description'),
    )
    manga.tags.extend(tags_list)
    manga.authors.extend(authors_list)
    db.session.add(manga)
    db.session.commit()
    # Upload cover to S3
    cover = request.files.get('cover')
    if cover:
        _, ext = splitext(cover.filename)
        if not ext or ext not in current_app.config['IMAGES_EXTENSION']:
            return jsonify({
                'code': 400,
                'message': 'Unsupport format files'
            }), 400
        cover_name = rand_str(32)
        cover_path = f'cover/{manga.id}/{cover_name}'
        bucket_name = os.environ['AWS_S3_BUCKET']
        expires = generate_expires_field()

        if not os.path.exists(f'/tmp/cover/{manga.id}'):
            os.makedirs(f'/tmp/cover/{manga.id}')
        cover.save(f'/tmp/{cover_path}')
        s3_bucket().upload_file(
            f'/tmp/{cover_path}', cover_path,
            ExtraArgs={
                'ContentType': f'image/{ext}',
                'Expires': expires,
            }
        )
        manga.cover = cover_path
        db.session.add(
            Images(
                url=cover_path,
                id_manga=manga.id,
            )
        )
        db.session.add(manga)
        db.session.commit()
        upload_webp.delay(cover_path, expires)
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


@bp.route('/<int:manga_id>/comment')
@load_manga
def get_comments(manga_id):
    """
    endpoint: /manga/<manga_id>/comments
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
          cover: manga_cover_url
    error:
      404:
        message: Not Found
    """
    comments = Comment.query.filter(
        Comment.id_manga == g.manga.id,
        Comment.id_chapter.is_(None),
    ).order_by(Comment.created.desc()).all()
    return jsonify(comments_schema.dump(comments).data)


@bp.route('/<int:manga_id>/comment', methods=('POST',))
@load_manga
@require_token
def post_comments(manga_id):
    """
    endpoint: /manga/<manga_id>/comments
    method: POST
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
          cover: manga_cover_url
    error:
      404:
        message: Not Found
    """
    data = request.get_json()
    if not data:
        return jsonify({
            'code': 400,
            'message': 'invalid request',
        }), 400

    if not data.get('content'):
        return jsonify({
            'code': 400,
            'message': 'No data is provided',
        }), 400

    comment = Comment(
        content=data.get('content'),
        id_manga=g.manga.id,
        user_uid=g.uid
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment_schema.dump(comment).data)


@bp.route('/<int:manga_id>/favorite', methods=('GET', ))
@load_token
def get_favorite_mange(manga_id):
    """
    endpoint: /manga/<manga_id>/favorite
    method: GET
    response:
        total: total_favorited
        status: False
    """
    total_favorited = UsersManga.query.filter_by(
        manga_id=manga_id,
        favorited=True,
    ).count()
    if g.uid:
        status = (
            UsersManga.query.with_entities(UsersManga.favorited)
            .filter_by(user_uid=g.uid, manga_id=manga_id)
            .scalar()
        )
    else:
        status = False
    return jsonify({
        'total': total_favorited,
        'status': status,
    }), 200


@bp.route('/<int:manga_id>/favorite', methods=('POST', ))
@require_token
def favorite_mange(manga_id):
    """
    endpoint: /manga/<manga_id>/favorite
    method: POST
    response:
        total: total_favorited
        status: False
    """
    user = User.query.get(g.uid)
    user_manga = UsersManga.query.filter_by(
        user_uid=g.uid,
        manga_id=manga_id
    ).first()
    if not user_manga:
        user_manga = UsersManga(
            user_uid=g.uid,
            manga_id=manga_id,
            favorited=False,
        )
    user_manga.favorited = not user_manga.favorited
    db.session.add(user_manga)
    db.session.commit()
    total_favorited = UsersManga.query.filter_by(
        manga_id=manga_id,
        favorited=True,
    ).count()
    return jsonify({
        'total': total_favorited,
        'status': user_manga.favorited,
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
          cover: manga_cover_url
    error:
      404:
        message: Not Found
    """
    chapters = Chapter.query.filter_by(
                manga_id=g.manga.id
               ).order_by(Chapter.chapter.desc(), Chapter.created.desc()).all()
    return jsonify(chapters_schema.dump(chapters).data)
