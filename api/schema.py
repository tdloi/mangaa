from os import environ
from urllib.parse import urljoin

from flask_marshmallow import Marshmallow, base_fields
from marshmallow import pre_dump, pre_load

from .models import Author, Chapter, Comment, Images, Manga, Tag, User

ma = Marshmallow()


class MangaBaseSchema(ma.ModelSchema):
    """ Manga Schema removed all many-to-many relationship fields"""
    class Meta:
        model = Manga
        exclude = ("users", "chapters", "tags", "authors",)

    url = base_fields.Function(
        lambda obj: f"/manga/{obj.id}/{obj._title}"
    )
    cover = base_fields.Function(
        lambda obj: urljoin(environ.get('AWS_S3_HOST'), obj.cover)
        if obj.cover
        else environ.get('MANGA_COVER_PLACEHOLDER', '/manga-cover.png')
    )

    @pre_dump
    def slug_title(self, data):
        _title = data.title.lower().strip().replace(' ', '-')
        setattr(data, '_title', _title)
        return data


class TagSchema(ma.ModelSchema):
    class Meta:
        model = Tag
        exclude = ("type",)
    url = base_fields.Function(lambda obj: f'/tag/{obj.url}')
    mangas = ma.Nested(MangaBaseSchema, many=True)


class AuthorSchema(ma.ModelSchema):
    class Meta:
        model = Author
        exclude = ("is_author", "is_artist",)
    url = base_fields.Function(lambda obj: f'/author/{obj.id}')
    mangas = ma.Nested(MangaBaseSchema, many=True)


class ImageSchema(ma.ModelSchema):
    class Meta:
        model = Images
        exclude = ('manga',)
    url = base_fields.Function(
        lambda obj: urljoin(environ.get('AWS_S3_HOST'), obj.url))


class CommentSchema(ma.ModelSchema):
    class Meta:
        model = Comment
    user = base_fields.Function(lambda obj: obj.user_uid)
    created = base_fields.Function(lambda obj: obj.created * 1000)


class MangaSchema(MangaBaseSchema):
    class Meta:
        model = Manga
        exclude = ("users", "covers", "chapters",)
    tags = ma.Nested(TagSchema(exclude=("mangas", )), many=True)
    authors = ma.Nested(AuthorSchema(exclude=("mangas", )), many=True)


class ChapterSchema(ma.ModelSchema):
    class Meta:
        model = Chapter
        exclude = ('read_by_users', 'lists',)
    vol = base_fields.Function(
        lambda obj: None
        if not obj.vol or int(obj.vol) == 0 else (
            int(obj.vol) if int(obj.vol) == obj.vol else obj.vol
        )
    )
    chapter = base_fields.Function(
        lambda obj: int(obj.chapter)
        if int(obj.chapter) == obj.chapter else obj.chapter
    )
    url = base_fields.Function(lambda obj: f'/chapter/{obj.id}')
    manga = ma.Nested(MangaBaseSchema(only=('title', 'url', 'cover', 'id',)))
    created = base_fields.Function(lambda obj: obj.created * 1000)


class UserSchema(ma.ModelSchema):
    class Meta:
        model = User
        exclude = ('uploaded_chapters', 'read_chapters')
    mangas = ma.Nested(MangaBaseSchema, many=True)


# init schema, include this insteead of Schema class
# except need to include/exclude fields for specific usecase
tag_schema = TagSchema()
tags_schema = TagSchema(many=True)
author_schema = AuthorSchema()
authors_schema = AuthorSchema(many=True)
manga_schema = MangaSchema()
mangas_schema = MangaSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
image_schema = ImageSchema()
images_schema = ImageSchema(many=True)
comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)
chapter_schema = ChapterSchema()
chapters_schema = ChapterSchema(many=True)
