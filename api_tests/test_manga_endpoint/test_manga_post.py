from api.models import db, Manga


def test_empty_body_data(client, endpoint):
    res = client.post(f'{endpoint}/manga', json={}).get_json()

    assert res['code'] == 400
    assert res['message'] == 'No data provided'


def test_missing_title(client, endpoint):
    res = client.post(f'{endpoint}/manga', json={
        'somefield': 'somevalue',
    }).get_json()

    assert res['code'] == 400
    assert res['message'] == 'Missing Manga title field'


def test_invalid_tags(client, endpoint):
    res = client.post(f'{endpoint}/manga', json={
        'title': 'random',
        'tags': [
            'some_random_tag'
        ]
    }).get_json()

    assert res['code'] == 400
    assert res['message'] == 'Invalid tags field'


def test_success_post(client, endpoint):
    rv = client.post(f'{endpoint}/manga', json={
        'title': 'manga',
        'alt_titles': 'alt manga',
        'description': 'abc',
        'cover': 'https://source.unsplash.com/featured/1000x1400?sig=12345',
    })
    res = rv.get_json()

    manga = Manga.query.order_by(Manga.id.desc()).first()

    assert rv.status_code == 201
    assert res['id'] == manga.id
    assert res['title'] == manga.title
    assert res['cover'] == manga.cover

    # clean up
    db.session.delete(manga)
    db.session.commit()
