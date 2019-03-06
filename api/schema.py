from flask_marshmallow import Marshmallow, base_fields
from marshmallow import pre_load, pre_dump

from .models import Author, Images, Manga, Tag, User, Chapter

ma = Marshmallow()


class MangaBaseSchema(ma.ModelSchema):
    """ Manga Schema removed all many-to-many relationship fields"""
    class Meta:
        model = Manga
        exclude = ("users", "covers", "chapters", "tags", "authors",)

    url = base_fields.Function(
        lambda obj: f"/manga/{obj.id}/{obj._title}"
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
        only = ('url', 'created', 'order')


class MangaSchema(MangaBaseSchema):
    class Meta:
        model = Manga
        exclude = ("users", "covers", "chapters",)
    tags = ma.Nested(TagSchema(exclude=("mangas", )), many=True)
    authors = ma.Nested(AuthorSchema(exclude=("mangas", )), many=True)


class ChapterSchema(ma.ModelSchema):
    class Meta:
        model = Chapter
    url = base_fields.Function(lambda obj: f'/manga/{obj.manga.id}/chapter/{obj.id}')


class UserSchema(ma.ModelSchema):
    class Meta:
        model = User
        exclude = ('chapters',)


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
chapter_schema = ChapterSchema()
chapters_schema = ChapterSchema(many=True)
