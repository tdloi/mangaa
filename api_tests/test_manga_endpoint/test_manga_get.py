from api.models import Manga


def test_manga_invalid_id_not_found(client, endpoint):
    assert client.get(f'{endpoint}/manga/abc').status_code == 404
    assert client.get(f'{endpoint}/manga/-1').status_code == 404


def test_manga_not_found(client, endpoint):
    res = client.get(f'{endpoint}/manga/999999999999').get_json()

    assert res['code'] == 404
    assert res['message'] == 'Not Found'


def test_manga_get_success(client, endpoint):
    manga = Manga.query.get(1)

    rv = client.get(f'{endpoint}/manga/1')
    res = rv.get_json()

    assert rv.status_code == 200
    assert res['id'] == manga.id
    assert res['title'] == manga.title

    assert len(res['tags']) == len(manga.tags)
    assert len(res['authors']) == len(manga.authors)
