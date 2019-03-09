from os import environ


def postgres_uri():
    user = environ.get('POSTGRES_USER')
    password = environ.get('POSTGRES_PASSWORD')
    host = environ.get('POSTGRES_HOST')
    port = environ.get('POSTGRES_PORT')
    db = environ.get('POSTGRES_DB')
    return f'postgresql+://{user}:{password}@{host}:{port}/{db}'


class Config:
    SECRET_KEY = environ.get('FLASK_SECRET')
    DEBUG = environ.get('FLASK_DEBUG', False)
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL', postgres_uri())
    SQLALCHEMY_TRACK_MODIFICATIONS = environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)
