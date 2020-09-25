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
    # create response object
    response = Response()

    # serialize request JSON data
    new_user_serializer = UserCreateSerializer(data=request.data)

    # print(request.data.get('password'), request.data.get('password2'))

    if request.data.get('password') != request.data.get('password2'):
        # if serializer is invalid
        response.data = {'msg': "Passwords don't match"}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response

    if new_user_serializer.is_valid():
        # If the data is valid, create the item in the database
        new_user = new_user_serializer.save()

        # generate access and refresh tokens for the new user
        access_token = generate_access_token(new_user)
        refresh_token = generate_refresh_token(new_user)

        # attach the access token to the response data
        # and set the response status code to 201
        response.data = {'accessToken': access_token}
        response.status_code = status.HTTP_201_CREATED

        # create refreshtoken cookie
        response.set_cookie(
            key='refreshtoken',
            value=refresh_token,
            httponly=True,  # to help prevent XSS
            samesite='strict',  # to help prevent XSS
            domain='localhost',  # change in production
            # secure=True # for https connections only
        )

        # return successful response
        return response

    # if serializer is invalid
    response.data = {'msg': 'Incorrect username or password'}
    response.status_code = status.HTTP_400_BAD_REQUEST
    # if the serialized data is NOT valid
    # send a response with error messages and status code 400
    response.data = {
        'error': [msg for msg in new_user_serializer.errors.values()]}
    response.status_code = status.HTTP_400_BAD_REQUEST
    # return failed response
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    '''
    POST: Validate User credentials and generate refresh and access tokens
    '''
    response = Response()
    username = request.data.get('username')
    password = request.data.get('password')

    if username is None or password is None:
        response.data = {'msg': 'Username and password required.'}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response

    user = User.objects.filter(username=username).first()

    if user is None or not user.check_password(password):
        response.data = {
            'msg': 'Incorrect username or password'
        }
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response

    # generate access and refresh tokens for the current user
    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)

    try:
        # if the user has a refresh token in the db,
        # get the old token
        old_refresh_token = RefreshToken.objects.get(user=user.id)
        # delete the old token
        old_refresh_token.delete()
        # generate new token
        RefreshToken.objects.create(user=user, token=refresh_token)

    except RefreshToken.DoesNotExist:
        # assign a new refresh token to the current user
        RefreshToken.objects.create(user=user, token=refresh_token)

    # create refreshtoken cookie
    response.set_cookie(
        key='refreshtoken',  # cookie name
        value=refresh_token,  # cookie value
        httponly=True,  # to help prevent XSS
        samesite='strict',  # to help prevent XSS
        domain='localhost',  # change in production
        # secure=True # for https connections only
    )

    response.data = {
        'accessToken': access_token
    }
    response.status_code = status.HTTP_200_OK
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SafeJWTAuthentication])
def auth(request):
    '''Return the user data for the user id contained in a valid access token'''
    # create response object
    response = Response()

    # Get the access token from headers
    access_token = request.headers.get('Authorization').split(' ')[1]

    # decode token payload
    payload = jwt.decode(
        access_token,
        settings.SECRET_KEY,
        algorithms=['HS256']
    )

    # get the user with the same id as the token's user_id
    user = User.objects.filter(id=payload.get('user_id')).first()

    if user is None:
        response.data = {'msg': 'User not found'}
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    if not user.is_active:
        response.data = {'msg': 'User not active'}
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    # serialize the User object and attach to response data
    serialized_user = UserDetailSerializer(instance=user)
    response.data = {'user': serialized_user.data}

    return response


@api_view(['GET'])
@permission_classes([])
def extend_token(request):
    '''Return new access token if request's refresh token cookie is valid'''
    # create response object
    response = Response()

    # get the refresh token cookie
    refresh_token = request.COOKIES.get('refreshtoken')

    # if the refresh token doesn't exist
    # return 401 - Unauthorized
    if refresh_token is None:
        response.data = {
            'msg': 'Authentication credentials were not provided'
        }

        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    # if a token is found,
    # try to decode it
    try:
        payload = jwt.decode(
            refresh_token,
            settings.REFRESH_TOKEN_SECRET,
            algorithms=['HS256']
        )

    # if the token is expired, delete it from the database
    # return 401 Unauthorized
    except jwt.ExpiredSignatureError:
        # find the expired token in the database
        expired_token = RefreshToken.objects.filter(
            token=refresh_token).first()

        # delete the old token
        expired_token.delete()

        response.data = {
            'error': 'Expired refresh token, please log in again.'
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED

        # remove refresh token cookie
        response.delete_cookie('refreshtoken')
        return response

    # get the user asscoiated with token
    user = User.objects.filter(id=payload.get('user_id')).first()
    if user is None:
        response.data = {
            'msg': 'User not found'
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    if not user.is_active:
        response.data = {
            'msg': 'User is inactive'
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    # generate new refresh token
    new_refresh_token = generate_refresh_token(user)

    # Delete old refresh token
    # if the user has a refresh token in the db,
    # get the old token
    old_refresh_token = RefreshToken.objects.filter(user=user.id).first()
    if old_refresh_token:
        # delete the old token
        old_refresh_token.delete()

    # assign a new refresh token to the current user
    RefreshToken.objects.create(user=user, token=new_refresh_token)

    # change refreshtoken cookie
    response.set_cookie(
        key='refreshtoken',  # cookie name
        value=new_refresh_token,  # cookie value
        httponly=True,  # to help prevent XSS attacks
        samesite='strict',  # to help prevent XSS attacks
        domain='localhost',  # change in production
        # secure=True # for https connections only
    )

    new_access_token = generate_access_token(user)

    response.data = {'accessToken': new_access_token}
    return response

@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([SafeJWTAuthentication])
@ensure_csrf_cookie
def user_detail(request, pk):
    '''
    GET: Get the user data associated with the pk
    POST: Update the user data associated with the pk
    '''
    response = Response()
    user = User.objects.filter(pk=pk).first()

    if user is None:
        response.data = {
            'msg': 'User not found'
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED

        return response

    if not user.is_active:
        response.data = {
            'msg': 'User is inactive'
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    # Get the access token from headers
    access_token = request.headers.get('Authorization').split(' ')[1]

    # decode token payload
    payload = jwt.decode(
        access_token,
        settings.SECRET_KEY,
        algorithms=['HS256']
    )

    if pk != payload.get('user_id'):
        response.data = {
            'msg':'Not authorized'
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    if request.method == 'GET':
        serialized_user = UserDetailSerializer(instance=user)

        response.data = {'user': serialized_user.data}
        response.status_code = status.HTTP_200_OK

        return response

    if request.method == 'PUT':
        # print(response.cookies.get('csrftoken'))

        serialized_user = UserCreateSerializer(data=request.data, partial=True)

        if serialized_user.is_valid():
            serialized_user.update(instance=user, validated_data=serialized_user.validated_data)
            response.data = {'msg': 'Account info updated successffully'}
            response.status_code = status.HTTP_202_ACCEPTED
            return response

        response.data = {'error':serialized_user.errors}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response

@api_view(['GET'])
def logout(request):
    '''Delete refresh token from the database
    and delete the refreshtoken cookie'''

    

    response = Response()

    # find the logged in user's refresh token
    refresh_token = RefreshToken.objects.filter(user=request.user.id).first()

    if refresh_token is None:
        response.data = {'msg':'Not logged in'}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response

    # if the token is found, delete it
    refresh_token.delete()

    # remove the refreshtoken and csrftoken cookies
    response.delete_cookie('refreshtoken')
    response.delete_cookie('csrftoken')


    response.data = {
        'msg': 'Logout successful. See you next time!'
    }

    return response