""" Append root path to PATH to import api module
    and push flask application context
"""
from sys import path
from os.path import dirname

path.append(dirname(path[0]))


from api import create_app  # isort:skip  # noqa

app = create_app()
app.app_context().push()
