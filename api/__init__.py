from os import environ

from flask import Flask, current_app

from celery import Celery
from .config import configs, Config


celery = Celery(
        __name__,
        backend=Config.CELERY_RESULT_BACKEND,
        broker=Config.CELERY_BROKER_URL,
    )


def create_app(config=None):
    app = Flask(__name__)

    env = environ.get('FLASK_ENV', 'default')
    if not config:
        config = configs[env]
    elif type(config) == str:
        config = configs.get(config, configs['default'])
    app.config.from_object(config)

    from .models import db
    db.init_app(app)

    from .schema import ma
    ma.init_app(app)

    from .cli import generate
    app.cli.add_command(generate)

    from .v1 import init_blueprint
    init_blueprint(app)

    celery.conf.update(app.config)

    return app
