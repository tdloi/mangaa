import pytest

from api.models import Manga, db


def test_manga_index_400(client, endpoint):
    rv = client.get(f'{endpoint}/manga', json=dict({
        'page': 'abc',
    }))
    res = rv.get_json()

    assert res['code'] == 400
    assert res['message'] == 'Invalid page number value'


def test_manga_index_404(client, endpoint):
    rv = client.get(f'{endpoint}/manga', json=dict({
        'page': 9999999999999999,
    }))
    res = rv.get_json()

    assert res['code'] == 404
    assert res['message'] == 'Not Found'


def test_manga_index_pagination(client, endpoint):
    total = db.session.query(Manga).count()
    total_page = int(total/20)
    rv = client.get(f'{endpoint}/manga', json=dict({
        'page': 1,
    }))
    res = rv.get_json()

    assert res['page'] == 1
    assert res['totalPage'] == total_page
    assert res['nextPage'] == 2
    assert res['prevPage'] is None
    assert res['results'] is not None
