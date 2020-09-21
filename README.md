# JSON Web Token & CSRF Token Authentication between a Django REST Framework API and React

Last updated: 9/20/2020

This is an example of using a custom Django REST Framework (DRF) authentication class to access protected API routes from a React application.

Authentication will require three items:

1. Django's Cross-Site Request Forgery (CSRF) Token
2. JSON Web Token (JWT) Access Token
3. JWT Refresh Token


This guide is based on:

- [Django Rest Framework custom JWT authentication](https://dev.to/a_atalla/django-rest-framework-custom-jwt-authentication-5n5) by Ahmed Atalla

- [The Ultimate Guide to handling JWTs on frontend clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/) by Hasura



## <p id="top">Table of contents</p>

- ## [Setup](#setup)
  - [Environment Variables](#environment-variables)
- ## [Backend](#backend)
  - ### [Dependencies](#backend-dependencies)
  - ### [Create Django Project](#create-django-project)
    - [settings.py](#django-settings)
    - [Users App](#users-app)
      - [models.py](#users-models)
      - [admin.py](#users-admin)
      - [serializers.py](#sers-serializers)
- [Frontend](#frontend)

---

## <p id="setup">Setup</p>

[Top &#8593;](#top)

This project will be using Django 3.1 and React via create-react-app 3.4.

Create a folder `jwt_drf_react` for the project. Inside create a folder for `backend` and `frontend`.

```bash
~/ $ mkdir jwt_def_react && cd mkdir jwt_def_react
jwt_def_react/ $ mkdir backend frontend
```

## <p id="environment-variables">Environment Variables</p>
[Top &#8593;](#top)

Create a file called `.env` in the `jwt_drf_react` project folder. This file will be used to define environment variables. You will want to add this file the your `.gitignore` file to keep your secrets secret.

### .env

```python
DJANGO_DEBUG = 'True'

# Django secret keys
DJANGO_SECRET_KEY_DEVELOPMENT='xxxxxxxxxx'
DJANGO_SECRET_KEY_PRODUCTION='xxxxxxxxxx'

# Key for encoding user refresh tokens
DJANGO_REFRESH_TOKEN_SECRET='xxxxxxxxxx'
```

Current file structure:

```bash
jwt_def_react/
│   .env
│   .gitignore
├───backend
└───frontend
```

## <p id="backend">Backend</p>
[Top &#8593;](#top)

Initialize Pipenv and install Django and other required packages.

```bash
backend/ $ pipenv shell
...creating virtualenv...

$ pipenv install django==3.1.1 djangorestframework==3.11.1 django-cors-headers==3.5.0 python-decouple==3.3 pyjwt==1.5.3
```

### <p id="backend_dependencies">Backend Dependencies</p>
[Top &#8593;](#top)

- Django - Python framework for building web apps
- Django REST Framework - A powerful and flexible toolkit for building Web APIs.
- Django CORS Headers - A Django App that adds Cross-Origin Resource Sharing (CORS) headers to responses. This allows in-browser requests to your Django application from other origins.
- Python Decouple - Package for managing environment variables
- PyJWT - Python package for using JSON Web Tokens

## <p id="create-django-project">Create Django Project</p>
[Top &#8593;](#top)

Create the Django project called `main`

```bash
jwt_drf_react/ $ django-admin startproject main .
```

The file tree should should look something like this:

```bash
jwt_drf_react/
│   .env
│   .gitignore
│
├───backend
│   │   manage.py
│   │   Pipfile
│   │   Pipfile.lock
│   │
│   ├───main
│   │       asgi.py
│   │       settings.py
│   │       urls.py
│   │       wsgi.py
│   │       __init__.py
│
└───frontend
```

---

### <p id="django-settings">main/settings.py</p>
[Top &#8593;](#top)

```python
import decouple  # add

DEBUG = decouple.config('DJANGO_DEBUG') # pull DEBUG from .env

# set SECRET_KEY based on value of DEBUG
if DEBUG:
    SECRET_KEY = decouple.config('DJANGO_SECRET_KEY_DEVELOPMENT')
else:
    SECRET_KEY = decouple.config('DJANGO_SECRET_KEY_PRODUCTION')


INSTALLED_APPS = [
    ...

    'rest_framework', # add
    'corsheaders', # add

    'users', # add
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # add at the top
    ...
]

# add everything below to the bottom of settings.py

# REST Framework Defaults
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'users.authentication.SafeJWTAuthentication' # custom authentication class
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ]
}

# Secret for encoding User refresh tokens
REFRESH_TOKEN_SECRET = decouple.config('DJANGO_REFRESH_TOKEN_SECRET')

# Use custom user model for authentication
AUTH_USER_MODEL = 'users.User'

CORS_ALLOW_CREDENTIALS = True  # to accept cookies via axios

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://localhost:8000',
    # other whitelisted origins
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    # other allowed origins...
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    # other allowed origins...
]

CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'refresh_token'
    'x-csrftoken',
    # 'x-xsrf-token' # might not be needed
]

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    # other allowed hosts...
]
```

---

### <p id="users-app">Users App</p>
[Top &#8593;](#top)

Create a Django app called `users`.

```bash
backend/ $ python manage.py startapp users
```

### <p id="users-models">Custom User Model</p>
[Top &#8593;](#top)

We'll be using a custom user model by extending the `AbstractUser` class. This might not be strictly necessary, but it will be required if you want any additional fields to the User model.

We'll also be defining the `RefreshToken` model, which will be used to request new API access tokens later on.

### users/models.py

```python
from django.db import models
from django.contrib.auth.models import AbstractUser # add
from django.contrib.auth import get_user_model # add

class User(AbstractUser):
    email = models.EmailField(
        'email address',
        unique=True,
        error_messages={ # overwrite default error message for unique constraint
            'unique':"This email has already been registered."
        }
    )

    def __str__(self):
        return self.username

class RefreshToken(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    token = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.user}'s refresh token"
```

Make migrations / migrate new models

```bash
backend/ $ python manage.py makemigrations
Migrations for 'users':
  users\migrations\0001_initial.py
    - Create model User
    - Create model RefreshToken

backend/ $ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, users
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0001_initial... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... 
OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying users.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying sessions.0001_initial... OK
```

### <p id="users-admin">users/admin.py</p>
[Top &#8593;](#top)

```python
from django.contrib import admin

from .models import User, RefreshToken

# register models in admin
admin.site.register([User, RefreshToken])
```

### <p id="superuser">Create superuser</p>
[Top &#8593;](#top)

```bash
backend/ $ python manage.py createsuperuser
```

Login to the admin panel to ensure your models are showing up.

---

### <p id="users-serializers">users/serializers.py</p>

[Top &#8593;](#top)

Create `serializers.py`. We'll have to overwrite the `create()` and `update()` methods for the `UserCreateSerializer` class in order to encrypt the user's password string.

```python
from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserCreateSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        password = validated_data.get('password', None)
        instance = self.Meta.model(**validated_data)

        # call set_password() to hash the user's password
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                # call set_password() to hash the user's password
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password']


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'email',
            'id',
            'last_login',
            'date_joined',
        ]
```

