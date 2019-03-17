from os import environ
from os.path import splitext

from flask import jsonify, current_app

from . import celery, create_app
from .utils.helpers import generate_expires_field, s3_bucket, s3_client
from .models import db, Images


@celery.task(bind=True)
def upload_image(self, list_images, chapter_id):
    """
    Long running task uploads a list of images name (saved to /tmp)
    and add record to Images table
    """
    bucket_name = environ['AWS_S3_BUCKET']
    location = s3_client().get_bucket_location(Bucket=bucket_name)['LocationConstraint']
    total = len(list_images)
    completed_images = set()

    app = create_app(environ.get('FLASK_ENV', 'default'))
    app.app_context().push()

    for current, image in enumerate(list_images, start=1):
        ext = splitext(image)[1][1:]   # remove . in ext to put in ContentType
        # TODO: handlle upload fail
        s3_bucket().upload_file(
            f'/tmp/{image}', image,
            ExtraArgs={
                'ACL': 'public-read',
                'ContentType': f'image/{ext}',
                'Expires': generate_expires_field(),
            })
        url = f'https://s3-{location}.amazonaws.com/{bucket_name}/{image}'
        completed_images.add(url)

        db.session.add(Images(
            url=url,
            id_chapter=chapter_id,
        ))
        db.session.commit()

        self.update_state(state='PROGRESS',
                          meta={
                            'status': 'Progressing',
                            'current': current,
                            'total': total,
                            'results': list(completed_images)})
    return {
        'status': 'Completed',
        'current': None,
        'total': total,
        'results': list(completed_images),
        'location': f'/chapter/{chapter_id}',
    }
