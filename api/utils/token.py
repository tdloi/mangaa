""" Helper function to create token for local development and testing
"""
import os

import firebase_admin
import requests
from firebase_admin import auth, credentials


def create_custom_token(uid, claim=None, service_account_path=None):
    """
    Generate a custom token using service account json file

    claim: a dictionary contains attribute to add to user id_token
    service_account_path: path contains service account json file, default on
    `data/serviceAccountKey.json` from project root
    """
    if not service_account_path:
        service_account_path = 'data/serviceAccountKey.json'
    cred = credentials.Certificate(service_account_path)
    default_app = firebase_admin.initialize_app(cred)
    custom_token = auth.create_custom_token(uid, developer_claims=claim)
    firebase_admin.delete_app(default_app)
    return custom_token.decode('utf-8')


def exchange_custom_token(custom_token):
    """
    Send created custom token to Google API to exchange for signed token,
    this token is the same as token recieved from firebase when user logged in.
    """
    body = {
        "token": custom_token,
        "returnSecureToken": True
    }
    url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key="
    key = os.environ.get('REACTE_APP_FIREBASE_APIKEY')
    token = requests.post(f'{url}{key}', data=body).json()
    if token.get('error'):
        raise ValueError(token)
    return token


def create_token(uid, claim=None, service_account_path=None):
    """
    Wrapper function to send created custom token from an uid to Google API, will
    raise error if there is an initialized app

    If uid does not exist, Firebase will create one. To know if a new user is
    created, check isNewUser field in token
    If claim is existed, existed claim will be override with new claim.
    Fore more info:
    https://firebase.google.com/docs/auth/admin/custom-claims#set_and_validate_custom_user_claims_via_the_admin_sdk
    """
    custom_token = create_custom_token(uid, claim, service_account_path)
    return exchange_custom_token(custom_token)


def firebase_init():
    cred = credentials.Certificate('data/serviceAccountKey.json')
    default_app = firebase_admin.initialize_app(cred)
    yield default_app
    firebase_admin.delete_app(default_app)
