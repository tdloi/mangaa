from flask import Blueprint, jsonify, make_response

from ..tasks import upload_image

bp = Blueprint('status', __name__)


@bp.route('/<task_id>')
def get(task_id):
    """
    endpoint: /status/task_id
    method: GET
    description: |
      Return status of current task, if task is completed, address of new collections
      resouces will be included in Location Header
    param:
      task_id: str
    response:
      state: SUCCESS
      current: null
      total: 10
      status: Completed
      results: [
        some_images_url
      ]
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
    task = upload_image.AsyncResult(task_id)
    if task.state == 'PENDING':
        # job did not start yet
        response = {
            'state': task.state,
            'current': 0,
            'total': None,
            'status': 'Pending',
            'results': None,
        }
        return jsonify(response)  # avoid null task.info
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total'),
            'status': task.info.get('status'),
            'results': task.info.get('results'),
        }
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': None,
            'total': None,
            'status': str(task.info),  # this is the exception raised
            'results': None,
        }

    if type(task.info) == dict and task.info.get('location'):
        response['location'] = task.info['location']
    return jsonify(response)
