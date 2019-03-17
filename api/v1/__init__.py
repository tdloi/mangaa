from . import manga, user, release


def init_blueprint(app):
    ver = "/api/v1"
    app.register_blueprint(manga.bp, url_prefix=f'{ver}/manga')
    app.register_blueprint(user.bp, url_prefix=f'{ver}/user')
    app.register_blueprint(release.bp, url_prefix=f'{ver}/release')
