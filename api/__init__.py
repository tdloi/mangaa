from flask import Flask


def create_app(config=None):
    app = Flask(__name__)
    if not config:
        from . import config
        app.config.from_object(config.Config)
    else:
        app.config.from_object(config)

    from .models import db
    db.init_app(app)

    return app
