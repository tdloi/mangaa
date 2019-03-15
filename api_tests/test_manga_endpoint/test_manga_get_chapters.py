from api.models import Chapter


def test_get_correct_number_of_chapters(client, endpoint):
    chapters = Chapter.query.filter_by(manga_id=1).all()

    rv = client.get(f'{endpoint}/manga/1/chapters')
    res = rv.get_json()

    assert len(chapters) == len(res)
