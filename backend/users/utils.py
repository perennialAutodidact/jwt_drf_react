# users/utils.py
import jwt
import datetime
from django.conf import settings

from users.models import User, RefreshToken

def generate_access_token(user):
    access_token_payload = {
        # id from User instance
        'user_id': user.id,
         # expiration date
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=5),
        # initiated at date
        'iat': datetime.datetime.utcnow(),
        # additional items if desired
        # ...
    }

    access_token = jwt.encode(
        access_token_payload,
        settings.SECRET_KEY,
        algorithm='HS256'
    ).decode(encoding='utf-8')

    return access_token


def generate_refresh_token(user):
    '''Generate JWT refresh token for the user'''
    refresh_token_payload = {
        # id from User instance
        'user_id': user.id,
         # expiration date
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        # initiated at date
        'iat': datetime.datetime.utcnow(),
        # additional items if desired
        # ...
    }

    # encode payload and decode jwt into a string
    refresh_token = jwt.encode(
        refresh_token_payload,
        settings.REFRESH_TOKEN_SECRET,
        algorithm='HS256'
    ).decode(encoding='utf-8')

    # convert refresh_token bytes object into utf-8 string
    return refresh_token


# Thanks to Ahmed Atalla for this code
# https://dev.to/a_atalla/django-rest-framework-custom-jwt-authentication-5n5