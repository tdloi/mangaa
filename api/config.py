from os import environ

class Config:
    SECRET_KEY = environ.get('FLASK_SECRET')
    DEBUG = environ.get('FLASK_DEBUG', False)
