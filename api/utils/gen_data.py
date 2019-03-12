import string
from calendar import timegm
from random import choice, randint, shuffle, sample
from time import gmtime

from faker import Faker

from api.models import *

fake = Faker()


def _get_image(size="1000x1400", sig=None):
    """
    Shortcut for return an unsplash featured image with sig, sig is necessary to
    avoid repeating images when display on the same screen
    """
    if not sig:
        sig = ''.join(choice(string.digits) for i in range(5))
    return f'https://source.unsplash.com/featured/{size}?sig={sig}'


def _gen_non_repeat(func, arg=None, size=5,  _set=None):
    """ Run generate with `func` function until it reach `size` and has no member in _set
    """
    if not _set:
        _set = set()
    new_items = set()
    while len(new_items) < size:
        # unpack argument to function call
        if arg:
            random_item = func(*arg)
        else:
            random_item = func()
        if random_item not in _set and random_item not in new_items:
            new_items.add(random_item)
    return new_items


def _gen_random_char(minlen, maxlen, collection=None):
    if not collection:
        collection = string.ascii_letters + '-_'
    return ''.join(
        choice(collection) for i in range(randint(minlen, maxlen))
    )


def _add_list_length(_list, length):
    """ Return new list with len `length`
    """
    list_len = len(_list)
    temp_list = _list[:]

    if list_len == 0:
        list_len = 1

    if list_len < length:
        n = int(length / list_len) + 1
        temp_list = temp_list * n
    shuffle(temp_list)
    return temp_list[:length]


def gen_user(total, avatar_size="400x400", user_list=None):
    list_username = _gen_non_repeat(_gen_random_char, (6, 10), size=total)
    list_uid = _gen_non_repeat(fake.uuid4, size=total)

    users = [
        User(
            uid=uuid,
            username=username,
            avatar=_get_image(size="400x400"),
        ) for uuid, username in zip(list_uid, list_username)
    ]

    return users


def gen_tag(total, tag_name_list=None):
    list_tags = _gen_non_repeat(fake.word, size=total, _set=tag_name_list)
    tags = [
        Tag(name=tag) for tag in list_tags
    ]
    return tags


def gen_author(total, is_author=True):
    is_artist = not is_author
    return [
        Author(
            name=fake.name(),
            is_author=is_author,
            is_artist=is_artist
        ) for i in range(total)
    ]


def gen_manga(total, author_list, artist_list, tag_list, num_tag_per_manga=2):
    author_list = _add_list_length(author_list, total)
    artist_list = _add_list_length(artist_list, total)
    manga_list = list()
    for author, artist in zip(author_list, artist_list):
        manga = Manga(
            title=' '.join(fake.words(randint(2, 12))),
            alt_titles=fake.sentence(10),
            description=fake.sentence(30),
            cover=_get_image(),
        )
        manga.authors.append(author)
        manga.authors.append(artist)
        manga.tags.extend(sample(tag_list, randint(2, num_tag_per_manga)))
        manga_list.append(manga)
    return manga_list


def gen_chapter(chap_per_manga, list_manga, list_users, min_chapter=None):
    """
    For each manga in `list_manga`, generate `chap_per_manga` chapters, if `min_chapter` is set
    random n chapter between min_chapter and chap_per_manga
    `list_manga` is a query list return by SQLAlchemy so that this function can access manga id,
    the same goes for `list_users`
    """
    chapters = []
    for manga in list_manga:
        n = chap_per_manga
        if min_chapter:
            n = randint(min_chapter, chap_per_manga)
        chapters.extend([
            Chapter(
                title=fake.sentence(),
                vol=int(i/10),
                chapter=i,
                uploader=choice(list_users).uid,
                manga_id=manga.id,
            ) for i in range(n)
        ])

    return chapters


def _gen_image(num_per_item, _list, is_covers=True, _min=None, images_list=None):
    """
    Generate n image for each item in _list or random between _min and num_per_item,
    because url images are unique, it accepts list of image object (return from
    SQLAlchemy query) to avoid duplicate with existed images
    """
    empty_list = (None for i in range(len(_list)))
    list_id = (item.id for item in _list)

    list_items = zip(list_id, empty_list)
    if not is_covers:
        # received list_id are list chapter id
        list_items = zip(empty_list, list_id)

    images = []
    url_images = set()
    if images_list:
        url_images = {i.url for i in images_list}

    for manga_id, chapter_id in list_items:
        n = num_per_item
        if _min:
            n = randint(_min, n)

        urls = _gen_non_repeat(_get_image, size=n, _set=url_images)
        url_images = url_images.union(urls)
        images.extend([
            Images(
                url=url,
                id_manga=manga_id,
                id_chapter=chapter_id,
                order=i,
            ) for i, url in enumerate(urls, start=1)
        ])
    return images


def gen_covers(num_per_item, list_manga, _min, images_list=None):
    """
    Generate `num_per_item` images for each manga in `list_manga`, if _min
    is set, it will random between `_min` and `num_per_item` images for each
    manga
    `list_manga` and `images_list` must be either a query list return from SQLAlchemy query or
    a list of Manga/Images object so that it can extract id use for foreign keys, and url
    to avoid primary key error
    """
    return _gen_image(
        num_per_item,
        _list=list_manga,
        is_covers=True,
        _min=_min,
        images_list=images_list,
    )


def gen_chapter_image(num_per_item, list_chapter, _min, images_list=None):
    """
    Generate `num_per_item` images for each chapter in `list_chapter`, if _min
    is set, it will random between `_min` and `num_per_item` images for each
    chapter
    `list_manga` and `images_list` must be either a query list return from SQLAlchemy query or
    a list of Manga/Images object so that it can extract id use for foreign keys, and url
    to avoid primary key error
    """
    return _gen_image(
        num_per_item,
        _list=list_chapter,
        is_covers=False,
        _min=_min,
        images_list=images_list,
    )
