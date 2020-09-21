import jwt

from django.conf import settings
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import exceptions
from rest_framework.decorators import (
    api_view, permission_classes,
    authentication_classes
)

from .utils import generate_access_token, generate_refresh_token
from .models import User, RefreshToken
from .serializers import UserCreateSerializer, UserDetailSerializer
from .authentication import SafeJWTAuthentication


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    '''Validate request POST data and create new User objects in database
    Return refresh and access tokens on successful registration'''
    response = Response()

    # serialize request JSON data
    new_user_serializer = UserCreateSerializer(data=request.data)

    if new_user_serializer.is_valid():
        # If the data is valid, create the item in the database
        new_user = new_user_serializer.save()

        # generate access and refresh tokens for the new user
        access_token = generate_access_token(new_user)
        refresh_token = generate_refresh_token(new_user)

        # attach the access token to the response 
        # and set the response status code to 201
        response.data = {'accessToken':access_token }
        response.status_code = status.HTTP_201_CREATED

        # create refreshtoken cookie
        response.set_cookie(
            key='refreshtoken',
            value=refresh_token,
            httponly=True,
            domain='localhost', # change in production
            samesite='strict',
            # secure=True # for https connections only
        )

        # return successful response
        return response


    # if the serialized data is NOT valid
    # send a response with error messages and status code 400
    
        # create a single list of all serializer errors
    error_keys = new_user_serializer.errors.keys()
    errors = map(
        lambda key: ','.join(new_user_serializer.errors.get(key)),
        error_keys
    )
    
    response.data = { 'errors': errors }
    response.status_code = status.HTTP_400_BAD_REQUEST
    # return failed response
    return response


# def auth(request):
#     '''
#     GET: Get the User associated with an access token
#     POST: "Login" - Validate User credentials and generate access token
#     '''
#     pass

# def extend_token(request):
#     '''Return new access token if request's 
#     refresh token cookie is valid'''
#     pass

# def user_detail(request, id):
#     '''
#     GET: Get the user data associated with the id
#     POST: Update the user data associated with the id
#     '''
#     pass

# def logout(request):
#     '''Delete refresh token from the database
#     and delete the refreshtoken cookie'''
#     pass
