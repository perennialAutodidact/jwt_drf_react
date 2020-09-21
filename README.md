# JSON Web Token & CSRF Token Authentication between a Django REST Framework API and React

Last updated: 9/20/2020

This is a guide for using a custom Django REST Framework (DRF) authentication class to access protected API routes from a React application.

This guide is based on:

- [Django Rest Framework custom JWT authentication](https://dev.to/a_atalla/django-rest-framework-custom-jwt-authentication-5n5) by Ahmed Atalla

- [The Ultimate Guide to handling JWTs on frontend clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/) by Hasura

## Table of contents

- [Setup](#setup)
  - [Backend](#backend)
  - [Frontend](#frontend)

Authentication will require three items:

1. Django's Cross-Site Request Forgery (CSRF) Token
2. JSON Web Token (JWT) Access Token
3. JWT Refresh Token

## <p id="setup">Setup</p>

This project will be using Django 3.1 and React via create-react-app 3.4.

Create a folder `jwt_auth` for the project. Inside create a folder for `backend` and `frontend`.

```bash
~ $ mkdir jwt_auth && cd mkdir jwt_auth
~/jwt_auth $ mkdir backend frontend
```

```bash
jwt_auth
├───backend
└───frontend
```

## <p id="backend">Backend</p>

Initialize Pipenv and install Django and other required packages.

```bash
$ pipenv shell
...creating virtualenv...

$ pipenv install django==3.1.1 djangorestframework==3.11.1 django-cors-headers==3.5.0 python-decouple==3.3 pyjwt==1.5.3
```

### Backend Dependencies

- Django - Python framework for building web apps
- Django REST Framework - A powerful and flexible toolkit for building Web APIs.
- Django CORS Headers - A Django App that adds Cross-Origin Resource Sharing (CORS) headers to responses. This allows in-browser requests to your Django application from other origins.
- Python Decouple - Package for managing environment variables
- PyJWT - Python package for using JSON Web Tokens

## Create Django Project

Create the Django project and an app called `users`.

```bash
~/jwt_auth $ django-admin startproject main .

~/jwt_auth $ python manage.py startapp users
```

```bash
backend/
│   manage.py
│   Pipfile
│   Pipfile.lock
│
├───main
│       asgi.py
│       settings.py
│       urls.py
│       wsgi.py
│       __init__.py
│
└───users
    │   admin.py
    │   apps.py
    │   models.py
    │   tests.py
    │   views.py
    │   __init__.py
    │
    └───migrations
            __init__.py
```
