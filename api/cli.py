from random import randint, sample

import click
from flask.cli import AppGroup
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_

from .models import Author, Chapter, Manga, Tag, User, db
from .utils.gen_data import (UsersManga, gen_author, gen_chapter,
                             gen_chapter_image, gen_covers, gen_manga, gen_tag,
                             gen_user)
from .utils.token import create_token


generate = AppGroup('gen')


def _bulk_insert(_list):
    try:
        db.session.bulk_save_objects(_list)
        db.session.commit()
        db.session.remove()
    except IntegrityError as e:
        print(e)
        exit(0)


@generate.command('db')
@click.option('--total', default=40, help='Number of record')
@click.option(
    '--all-chapters', is_flag=False,
    help='Generate the same chapter for each manga')
def generate_data(total, all_chapters):
    """
    Generate records for displaying on app in localhost

    For chapters, if flag --all-chapter is not raised, it will generate `total`
    chapter for first half manga, and random between 1 to total/2 for second half

    WARNING: This command intents to run init record for display data on app so number
    of images it will generate is SUPER HUGE, for testing, check `generate_test`
    """
    print('=== Generating Users, Tags, Authors, Artists ===')
    generate_user(total)
    generate_tags(total)
    generate_authors(total, is_author=True)
    generate_authors(total, is_author=False)
    print('Added Users, Tags, Authors, Artists')

    print('=== Generating Manga ===')
    generate_mangas(total)
    print('Added Manga')

    print('=== Generating Chapter ===')
    users = User.query.limit(total).all()
    mangas = Manga.query.order_by(Manga.id.desc()).limit(total).all()
    mangas = mangas[::-1]  # reverse so apply x chapter to first half manga
    half_len = int(len(mangas) / 2)
    chapters = gen_chapter(total, mangas[:half_len], users)

    min_chapter = None
    if not all_chapters:
        min_chapter = 1
        total = int(total/2)
    second_chapters = gen_chapter(total, mangas[half_len:], users, min_chapter)
    for c in chapters + second_chapters:
        db.session.add(c)
        db.session.commit()
    db.session.remove()
    print('Added Chapters')

    print('=== Generating Manga Cover and Chapters Content ===')
    mangas = Manga.query.order_by(Manga.id.desc()).limit(total).all()
    covers = gen_covers(total, mangas, 1)
    chapters = Chapter.query.order_by(Chapter.id.desc()).limit(total).all()
    chapters_content = gen_chapter_image(int(total/2), chapters, 1, covers)
    for i in covers + chapters_content:
        db.session.add(i)
        db.session.commit()
    db.session.remove()
    print('Added Covers and Chapters Content')

    print('=== Generating Manga Rating ===')
    mangas = Manga.query.order_by(Manga.id.desc()).limit(total).all()
    users = User.query.limit(total).all()
    users_manga = []
    for m in mangas:
        user_list = sample(users, int(total/2))
        users_manga.extend(
            UsersManga(
                rating=randint(5, 10),
                user=u,
                mangas=m,
            ) for u in user_list
        )
    for um in users_manga:
        db.session.add(um)
        db.session.commit()
    db.session.remove()
    print('Added Manga Rating')

    print('=== Generating Following Manga ===')
    mangas = Manga.query.all()
    users = User.query.limit(total).all()
    users_manga = []
    for u in users:
        manga = sample(mangas, int(total/2))
        users_manga.extend(
            UsersManga(
                subscribed=True,
                user=u,
                mangas=m,
            ) for m in manga
        )
    for um in users_manga:
        try:
            db.session.add(um)
            db.session.commit()
        # If it existed, just modify it then
        except IntegrityError:
            db.session.rollback()
            um = UsersManga.query.filter(and_(
                    UsersManga.user_uid == um.user.uid,
                    UsersManga.manga_id == um.mangas.id
                )).first()
            um.subscribed = True
            db.session.commit()
    db.session.remove()
    print('Added Following Manga')


@generate.command('testdb')
def generate_test_data():
    """Generate minimum records use for testing"""
    print('=== Generating Users, Tags, Authors, Artists ===')
    generate_user(40)
    generate_tags(40)
    generate_authors(40, is_author=True)
    generate_authors(40, is_author=False)

    print('=== Generating Manga ===')
    generate_mangas(40)  # for pagination

    print('=== Generating Chapter ===')
    user = User.query.first()
    manga = Manga.query.first()
    chapters = gen_chapter(20, [manga], [user])
    for c in chapters:
        db.session.add(c)
        db.session.commit()
    db.session.remove()

    print('=== Generating Manga Cover and Chapters Content ===')
    manga = Manga.query.first()
    covers = gen_covers(10, [manga], 1)
    chapter = Chapter.query.first()
    chapters_content = gen_chapter_image(25, [chapter], _min=None, images_list=covers)
    for i in covers + chapters_content:
        db.session.add(i)
        db.session.commit()
    db.session.remove()

    print('=== Generating Manga Rating ===')
    manga = Manga.query.first()
    users = User.query.limit(20).all()
    users_manga = [UsersManga(
                    rating=randint(5, 10),
                    user=u,
                    mangas=manga,
                  ) for u in users]
    for um in users_manga:
        db.session.add(um)
        db.session.commit()
    db.session.remove()

    print('=== Generating Following Manga ===')
    user = User.query.first()
    manga = Manga.query.all()
    users_manga = [UsersManga(
        subscribed=True,
        user=user,
        mangas=m,
    ) for m in manga]
    for um in users_manga:
        try:
            db.session.add(um)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            um = UsersManga.query.filter(and_(
                    UsersManga.user_uid == um.user.uid,
                    UsersManga.manga_id == um.mangas.id
                )).first()
            um.subscribed = True
            db.session.commit()
    db.session.remove()


@generate.command('token')
@click.argument('uid')
@click.option(
    '--claim', default=None,
    help="a dict contains custom claim, must be put insde '' to escape string")
def generate_token(uid, claim):
    """ Generate firebase token for given uid
    """
    print(create_token(uid, claim=claim))


@generate.command('idtoken')
@click.argument('uid')
@click.option(
    '--claim', default=None,
    help="a dict contains custom claim, must be put insde '' to escape string")
def generate_id_token(uid, claim):
    """  Generate firebase token and retrieve idToken for given uid
    """
    print(create_token(uid, claim=claim)['idToken'])


@generate.command('users')
@click.argument('total')
def _generate_user(total):
    generate_user(total)


def generate_user(total):
    users = gen_user(total)
    _bulk_insert(users)


@generate.command('tags')
@click.argument('total')
def _generate_tag(total):
    generate_tags(total)


def generate_tags(total):
    tags = gen_tag(total)
    _bulk_insert(tags)


@generate.command('author')
@click.argument('total')
@click.option('--is-author', is_flag=True)
def _generate_authors(total, is_author=True):
    generate_authors(total, is_author)


def generate_authors(total, is_author=True):
    _list = gen_author(total, is_author=is_author)
    _bulk_insert(_list)


@generate.command('mangas')
@click.argument('total')
def _generate_mangas(total):
    generate_mangas(total)


def generate_mangas(total):
    tags = Tag.query.order_by(Tag.id.desc()).limit(total).all()
    authors = Author.query.filter_by(
                is_author=True
              ).order_by(Author.id.desc()).limit(total).all()
    artists = Author.query.filter_by(
                is_author=False
              ).order_by(Author.id.desc()).limit(total).all()
    mangas = gen_manga(total=total, author_list=authors, artist_list=artists, tag_list=tags)
    # We need relationship with tag, author so do not use bulk_save_objects here
    # https://docs.sqlalchemy.org/en/latest/orm/persistence_techniques.html#orm-compatibility
    for m in mangas:
        db.session.add(m)
        db.session.commit()
    db.session.remove()
