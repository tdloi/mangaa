import string
from calendar import timegm
from random import choice
from os import environ
from time import gmtime, strftime, time

import boto3


def epoch_time():
    return timegm(gmtime())


def generate_expires_field(day=60*60*24*365*2):
    """ Generate expires header field, default to 2 year
    """
    next_expire_time = gmtime(time() + day)
    return strftime('%a, %d-%b-%Y %T', next_expire_time)


def rand_str(length=32):
    collections = string.ascii_letters + string.digits
    return ''.join(choice(collections) for _ in range(length))


def s3_bucket():
    s3 = boto3.resource(
        's3',
        aws_access_key_id=environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=environ['AWS_SECRET_ACCESS_KEY'],
    )
    bucket = s3.Bucket(environ.get('AWS_S3_BUCKET'))
    return bucket


def s3_client():
    client = boto3.client(
        's3',
        aws_access_key_id=environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=environ['AWS_SECRET_ACCESS_KEY'],
    )
    return client
