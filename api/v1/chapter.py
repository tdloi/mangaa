from os import environ
from os.path import splitext

from flask import Blueprint, current_app, g, jsonify, make_response, request
from sqlalchemy.exc import DataError, IntegrityError

from ..decorators import require_token
from ..models import Chapter, Images, Manga, db
from ..schema import chapter_schema, images_schema
from ..tasks import upload_image
from ..utils.helpers import generate_expires_field, rand_str, s3_bucket, s3_client

bp = Blueprint('chapter', __name__)


@bp.route('', methods=('POST',))
@require_token
def create():
    """
    endpoint: /chapter
    method: POST
    description: |
      Create a chapter upon valid request, images field will be uploaded to S3 and
      client will do long-polling to get status of uploaded images on `status/task_id`,
      location of new created chapters will include in header of `status` when task is
      completed
    param:
      images: files,
      vol (opt): float
      chapter: float
      title: str
      manga: int
      "[header: Authorization] Token": str - firebase token
    response:
      "[Header: Location]": /api/v1/status/task_id
    error:
      400:
        desc: Missing title or chapter fields
        code: 400
        message: Missing required field
      400:
        code: 400
        message: No files provided
      400:
        code: 400
        message: Unsupport format files
      404:
        desc: Provided manga id is not valid int or does not exist
        code: 404
        message: Manga does not exist
      500:
        code: 500
        message: Something went wronng
    """
    try:
        manga_id = request.form.get('manga', '_')
        manga = Manga.query.get(manga_id)
        if not manga:
            raise DataError
    except DataError:
        return jsonify({
            'code': 404,
            'message': 'Manga does not exist',
        }), 404

    if not request.form.get('title') or not request.form.get('chapter'):
        return jsonify({
            'code': 400,
            'message': 'Missing required field',
        }), 400

    if not request.files.values():
        return jsonify({
            'code': 400,
            'message': 'No files provided',
        }), 400

    extensions = {splitext(image.filename)[1] for image in request.files.values()}
    if None in extensions \
       or any(ext not in current_app.config['IMAGES_EXTENSION'] for ext in extensions):
        return jsonify({
            'code': 400,
            'message': 'Unsupport format files'
        }), 400

    try:
        chapter = Chapter(
                    title=request.form['title'],
                    vol=request.form.get('vol', None),
                    chapter=request.form['chapter'],
                    manga_id=request.form['manga'],
                    uploader=g.uid
                )
        db.session.add(chapter)
        db.session.commit()
    except IntegrityError:
        return jsonify({
            'code': 500,
            'message': 'Something went wrong',
        }), 500

    bucket_name = environ['AWS_S3_BUCKET']
    location = s3_client().get_bucket_location(Bucket=bucket_name)['LocationConstraint']

    list_images = set()

    for image in request.files.values():
        _, ext = splitext(image.filename)
        # random a unique images url
        while True:
            key = rand_str(64) + ext
            # Check for exist to avoid override
            i = Images.query.get(f'https://s3-{location}.amazonaws.com/{bucket_name}/{key}')
            if not i:
                list_images.add(key)
                break

        # TODO:
        # handle conflict in a small chance that processing images have the same key
        image.save(f'/tmp/{key}')

    task = upload_image.delay(list(list_images), chapter.id)
    response = make_response()
    response.headers['Location'] = f'api/v1/status/{task.id}'
    return response, 202


@bp.route('/<int:chapter_id>')
def get(chapter_id):
    """
    endpoint: /chapter/chapter_id
    method: GET
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
      lists:
        created: 123456789
    error:
      404:
        code: 404
        message: Not Founnd
    """
    chapter = Chapter.query.get(chapter_id)
    if not chapter:
        return jsonify({
            'code': 404,
            'message': 'Not Found',
        }), 404
    images = Images.query.filter_by(
                id_chapter=chapter_id
             ).order_by(Images.order, Images.created).all()
    response = chapter_schema.dump(chapter).data
    response['lists'] = images_schema.dump(images).data
    return jsonify(response)
