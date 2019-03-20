import subprocess
from os import environ, remove
from os.path import exists, splitext

from celery.task.control import revoke
from flask import jsonify

from . import celery, create_app
from .models import Images, db
from .utils.helpers import generate_expires_field, s3_bucket


@celery.task(bind=True)
def upload_image(self, list_images, chapter_id):
    """
    Long running task uploads a list of images name (saved to /tmp)
    and add record to Images table
    """
    bucket_name = environ['AWS_S3_BUCKET']
    total = len(list_images)
    completed_images = set()

    # celery is running as background process so there is no app_context
    app = create_app(environ.get('FLASK_ENV', 'default'))
    app.app_context().push()

    for current, image in enumerate(list_images, start=1):
        ext = splitext(image)[-1][1:]   # remove . in ext to put in ContentType
        expires = generate_expires_field()

        # TODO: handlle upload fail
        s3_bucket().upload_file(
            f'/tmp/{image}', image,
            ExtraArgs={
                'ContentType': f'image/{ext}',
                'Expires': expires,
            })
        url = f'https://{bucket_name}.s3.amazonaws.com/{image}'
        completed_images.add(url)

        db.session.add(Images(
            url=url,
            id_chapter=chapter_id,
            order=current,
        ))
        db.session.commit()

        upload_webp.delay(image, expires)

        self.update_state(state='PROGRESS',
                          meta={
                            'status': 'Progressing',
                            'current': current,
                            'total': total,
                            'chapter': chapter_id,
                            'results': list(completed_images)})
    return {
        'status': 'Completed',
        'current': None,
        'total': total,
        'results': list(completed_images),
        'location': f'api/v1/chapter/{chapter_id}',
    }


@celery.task
def upload_webp(image, expires):
    # convert and upload webp
    subprocess.call(
        ['cwebp', '-quiet', f'/tmp/{image}', '-o', f'/tmp/{image}.webp'])
    s3_bucket().upload_file(
        f'/tmp/{image}.webp', f'{image}.webp',
        ExtraArgs={
            'ContentType': 'image/webp',
            'Expires': expires,
        })
    remove(f'/tmp/{image}.webp')
    remove(f'/tmp/{image}')
