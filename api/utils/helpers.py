import string
from calendar import timegm
from random import choice
from time import gmtime


def epoch_time():
    return timegm(gmtime())


def rand_str(length=32):
    collections = string.ascii_letters + string.digits
    return ''.join(choice(collections) for _ in range(length))
