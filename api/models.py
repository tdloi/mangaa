from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    url = db.Column(db.String, unique=True)
    type = db.Column(db.String)

    def __init__(self, **kwargs):
        super(Tag, self).__init__(**kwargs)
        self.url = self.name.replace(' ', '-')


tags = db.Table(
    'tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('manga_id', db.Integer, db.ForeignKey('manga.id'), primary_key=True)
)


class Author(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    is_author = db.Column(db.Boolean, default=True)
    is_artish = db.Column(db.Boolean)


authors = db.Table(
    'authors',
    db.Column('author_id', db.Integer, db.ForeignKey('author.id'), primary_key=True),
    db.Column('manga_id', db.Integer, db.ForeignKey('manga.id'), primary_key=True)
)


class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    vol = db.Column(db.Float)
    chapter = db.Column(db.Float, nullable=False)
    created = db.Column(db.Integer)  # epoch
    uploader = db.Column(db.String, db.ForeignKey('user.uid'), nullable=False)
    manga_id = db.Column(db.Integer, db.ForeignKey('manga.id'), nullable=False)


class User(db.Model):
    uid = db.Column(db.String, primary_key=True)
    username = db.Column(db.String, unique=True)  # display on comment
    avatar = db.Column(db.String)

    chapters = db.relationship('Chapter', backref='user', lazy='subquery')


users_manga = db.Table(
    'users_manga',
    db.Column('user_uid', db.Integer, db.ForeignKey('user.uid'), primary_key=True),
    db.Column('manga_id', db.Integer, db.ForeignKey('manga.id'), primary_key=True),
    db.Column('rating', db.Integer),
    db.Column('subcribed', db.Boolean),
)


class Manga(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    alt_titles = db.Column(db.String)
    description = db.Column(db.String)
    cover = db.Column(db.String)  # url of current manga cover

    chapters = db.relationship('Chapter', backref='manga', lazy=True)
    covers = db.relationship('Images', backref='manga', lazy=True)

    tags = db.relationship(
        'Tag', secondary=tags, lazy='subquery',
        backref=db.backref('mangas', lazy=True)
    )
    authors = db.relationship(
        'Author', secondary=authors, lazy='subquery',
        backref=db.backref('mangas', lazy=True)
    )
    users = db.relationship(
        'User', secondary=users_manga, lazy='subquery',
        backref=db.backref('mangas', lazy=True)
    )


class Images(db.Model):
    url = db.Column(db.String, primary_key=True)  # File key when upload to S3
    created = db.Column(db.Integer)  # epoch
    id_manga = db.Column(db.Integer, db.ForeignKey('manga.id'))
    id_chapter = db.Column(db.Integer, db.ForeignKey('chapter.id'))
    order = db.Column(db.Integer)