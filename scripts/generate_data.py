from calendar import timegm
from random import choice, randint, sample
from time import gmtime

from faker import Faker
from requests import get

import init
from api.models import *

fake = Faker()

TOTAL_TAG = 50  # <=, due to tag name must be uniqued
TOTAL_AUTHOR = 50
TOTAL_ARTISH = 50

TOTAL_USER = 50  # <=, due to username must be uniqued
TOTAL_MANGA = 30
TOTAL_CHAPTER = 120

LOAD_IMAGES_FROM_UNSPLASH = False


epoch = timegm(gmtime())


def rand_epoch():
    return randint(epoch-10000, epoch)


def get_image(size="1000x1400", sig=randint(1, 1000)):
    if LOAD_IMAGES_FROM_UNSPLASH:
        return get(f'https://source.unsplash.com/{size}?sig={sig}').url
    return fake.uuid4()


print("--- Create Users---")
username_list = {fake.user_name() for i in range(TOTAL_USER)}
users = [
    User(
        uid=fake.uuid4(),
        username=username,
        avatar=get_image(size="400x400", sig=i),
    ) for i, username in enumerate(username_list, start=1)
]
db.session.bulk_save_objects(users)
db.session.commit()

print("--- Create Tag ---")
tags_list = {fake.word() for i in range(TOTAL_TAG)}
tags = [
    Tag(
        name=tag,
    ) for tag in tags_list
]
db.session.bulk_save_objects(tags)
db.session.commit()

print("--- Create Author/Artish ---")
authors = [
    Author(
        name=fake.name(),
    ) for i in range(TOTAL_AUTHOR)
]
artishes = [
    Author(
        name=fake.name(),
        is_author=False,
        is_artish=True,
    ) for i in range(TOTAL_ARTISH)
]
db.session.bulk_save_objects(authors)
db.session.bulk_save_objects(artishes)
db.session.commit()

print("--- Create Manga ---")
mangas = list()
users = User.query.all()
tags = Tag.query.all()
authors = Author.query.filter_by(is_author=True).all()
artishes = Author.query.filter_by(is_artish=True).all()
for i in range(TOTAL_MANGA):
    manga = Manga(
        title=' '.join(fake.words(randint(2, 12))),
        alt_titles=fake.sentence(10),
        description=fake.sentence(30),
    )
    manga.authors.append(choice(authors))
    manga.authors.append(choice(artishes))
    manga.tags.extend(sample(tags, randint(1, len(tags))))
    manga.users.extend(sample(users, randint(1, len(users))))
    mangas.append(manga)
db.session.bulk_save_objects(mangas)
db.session.commit()

print("--- Create Chapter ---")
mangas = Manga.query.all()
chapters = [
    Chapter(
        title=fake.sentence(),
        vol=randint(1, 10),
        chapter=randint(1, 50),
        created=rand_epoch(),
        uploader=choice(users).uid,
        manga_id=choice(mangas).id,
    ) for i in range(TOTAL_CHAPTER)
]
db.session.bulk_save_objects(chapters)
db.session.commit()

print("--- Create Cover Images ---")
images_url = set()
covers = set()
for x in range(len(mangas)):
    for y in range(randint(1, 3)):
        image = Images(
            url=get_image(size="1000x1400", sig=f'{x}{y}'),
            id_manga=choice(mangas).id,
            order=x
        )
        if image.url not in images_url:
            images_url.add(image.url)
            covers.add(image)

db.session.bulk_save_objects(list(covers))
db.session.commit()

print("--- Create Chapter Images ---")
chapters = Chapter.query.all()
chapters_images = set()
# Reuse images_url set because covers also in Images Table
# so image url in chapters_images must not be repeated
for x in range(len(chapters)):
    for y in range(randint(1, 3)):
        image = Images(
            url=get_image(size="1000x1400", sig=f'{x}{y}'),
            id_chapter=choice(chapters).id,
            order=x
        )
        if image.url not in images_url:
            images_url.add(image.url)
            chapters_images.add(image)
db.session.bulk_save_objects(list(chapters_images))
db.session.commit()
