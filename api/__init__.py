from os import environ

from flask import Flask
from .config import configs


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

    from .cli import generate_db
    app.cli.add_command(generate_db)

    from .v1 import init_blueprint
    init_blueprint(app)

    return app
