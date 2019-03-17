from os import environ


def postgres_uri():
    user = environ.get('POSTGRES_USER', 'postgres')
    password = environ.get('POSTGRES_PASSWORD')
    host = environ.get('POSTGRES_HOST', 'localhost')
    port = environ.get('POSTGRES_PORT', '5432')
    db = environ.get('POSTGRES_DB', 'postgres')
    return f'postgresql://{user}:{password}@{host}:{port}/{db}'


class Config:
    SECRET_KEY = 'secret-key'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL', 'sqlite:////tmp/sqlite.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    CELERY_BROKER_URL = environ.get('CELERY_BROKER_URL')
    CELERY_RESULT_BACKEND = environ.get('CELERY_RESULT_BACKEND')
    IMAGES_EXTENSION = environ.get('FLASK_ALLOW_IMAGES_EXTENSION', '.png .jpg .jpeg .webp').split()


class DevConfig(Config):
    DEBUG = True


class TestConfig(Config):
    TESTING = True


class ProdConfig(Config):
    SECRET_KEY = environ.get('FLASK_SECRET')
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL', postgres_uri())


configs = {
    'dev': DevConfig,
    'test': TestConfig,
    'prod': ProdConfig,
    'default': ProdConfig,
}
