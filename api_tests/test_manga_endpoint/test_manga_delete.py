from api.models import Manga, db


def test_delete_manga(client, endpoint):
    # create new empty for testing
    manga = Manga(title='no title')
    db.session.add(manga)
    db.session.commit()

    rv = client.delete(f'{endpoint}/manga/{manga.id}').get_json()

    assert rv['code'] == 200
    assert rv['message'] == 'Deleted'
