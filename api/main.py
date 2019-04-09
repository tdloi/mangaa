""" Blueprint handle request, response on application level
"""
import os
from flask import Blueprint

main = Blueprint('main', __name__)


@main.after_app_request
def add_cors(response):
    # TODO: Multiple CORS
    header = response.headers
    header['Access-Control-Allow-Origin'] = os.environ.get('FLASK_CORS')
    return response
