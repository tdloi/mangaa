import subprocess
from os import environ, remove
from os.path import exists, splitext
from urllib.parse import urljoin

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
    total = len(list_images)
    completed_images = set()

    # celery is running as background process so there is no app_context
    app = create_app(environ.get('FLASK_ENV', 'default'))
    app.app_context().push()

    for current, image in enumerate(list_images, start=1):
        name, ext = splitext(image)
        expires = generate_expires_field()

        # TODO: handlle upload fail
        s3_bucket().upload_file(
            f'/tmp/{image}', name,
            ExtraArgs={
                'ContentType': f'image/{ext}',
                'Expires': expires,
            })
        completed_images.add(urljoin(environ.get('AWS_S3_HOST'), name))

        db.session.add(Images(
            url=name,
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
        'location': f'/chapter/{chapter_id}',
    }


@celery.task
def upload_webp(image, expires):
    image_name, ext = splitext(image)
    # convert and upload webp
    subprocess.call(
        ['cwebp', '-quiet', f'/tmp/{image}', '-o', f'/tmp/{image_name}.webp'])
    s3_bucket().upload_file(
        f'/tmp/{image_name}.webp', f'{image_name}.webp',
        ExtraArgs={
            'ContentType': 'image/webp',
            'Expires': expires,
        })
    remove(f'/tmp/{image_name}.webp')
    remove(f'/tmp/{image}')
