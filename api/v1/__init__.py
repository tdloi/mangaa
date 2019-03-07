from . import manga, user


def init_blueprint(app):
    ver = "/api/v1"
    app.register_blueprint(manga.bp, url_prefix=f'{ver}/manga')
    app.register_blueprint(user.bp, url_prefix=f'{ver}/user')
