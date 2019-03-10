import pytest

from api import create_app


@pytest.fixture
def client():
    app = create_app('test')
    client = app.test_client()

    yield client
