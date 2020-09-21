from django.contrib import admin

from .models import User, RefreshToken

# register models in admin
admin.site.register([User, RefreshToken])