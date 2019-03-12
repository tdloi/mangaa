from calendar import timegm
from time import gmtime


def epoch_time():
    return timegm(gmtime())
