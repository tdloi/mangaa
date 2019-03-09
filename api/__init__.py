from os import environ

from flask import Flask
from .config import configs


def create_app(config=None):
    app = Flask(__name__)

    env = environ.get('FLASK_ENV', 'default')
    if not config:
        config = configs[env]
    app.config.from_object(config)

    from .models import db
    db.init_app(app)

    from .schema import ma
    ma.init_app(app)

    from .v1 import init_blueprint
    init_blueprint(app)

    return app
