""" Blueprint handle request, response on application level
"""
import os
from flask import Blueprint, jsonify

main = Blueprint('main', __name__)


@main.after_app_request
def add_cors(response):
    # TODO: Multiple CORS
    header = response.headers
    header['Access-Control-Allow-Origin'] = os.environ.get('FLASK_CORS')
    header['Access-Control-Allow-Headers'] = "Authorization, Content-Type, Origin, Accept"
    header['Access-Control-Expose-Headers'] = 'Location'
    return response


@main.before_app_request
def maintained():
    if os.environ.get('FLASK_MAINTAINANCE') == 'true':
        return jsonify({
            'code': 503,
            'message': 'Server is under maintenance'
        }), 503
