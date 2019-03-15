from flask import g


def test_with_string_page_num(client, endpoint):
    rv = client.get(f'{endpoint}/manga', json={
        'page': 'abc',
    })
    res = rv.get_json()

    assert res['code'] == 400
    assert res['message'] == 'Invalid page number value'


def test_with_float_page_num(client, endpoint):
    rv = client.get(f'{endpoint}/manga', json={
        'page': 1.1,
    })
    res = rv.get_json()

    assert res['code'] == 400
    assert res['message'] == 'Invalid page number value'


def test_load_correct_page_num(client, endpoint):
    rv = client.get(f'{endpoint}/manga', json={
        'page': 1,
    })

    assert g.page == 1
