import os

import firebase_admin
import requests
from firebase_admin import auth, credentials


def create_custom_token_from_uid(uid, service_account_path=None):
    """ Generate a custom token using service account json file
    """
    if not service_account_path:
        service_account_path = 'data/serviceAccountKey.json'
    cred = credentials.Certificate(service_account_path)
    default_app = firebase_admin.initialize_app(cred)
    custom_token = auth.create_custom_token(uid)
    firebase_admin.delete_app(default_app)
    return custom_token.decode('utf-8')


def create_id_token(uid, service_account_path=None):
    """ 
    Send created custom token to Google API in exchange for
    signed token, this token is same as token recieved from firebase
    when user log in
    """
    custom_token = create_custom_token_from_uid(uid, service_account_path) 
    body = {
        "token": custom_token,
        "returnSecureToken": True
    }
    url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key="
    key = os.environ.get('REACTE_APP_FIREBASE_APIKEY')
    token = requests.post(f'{url}{key}', data=body).json()    
    return token['idToken']
