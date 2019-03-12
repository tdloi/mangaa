from os import environ

import pytest

from api import create_app


@pytest.fixture(scope='module')
def client():
    app = create_app('test')
    client = app.test_client('test')

    with app.app_context():
        yield client


@pytest.fixture
def endpoint():
    endpoint = environ.get('API_ENDPOINT', '/api/v1')
    yield endpoint
