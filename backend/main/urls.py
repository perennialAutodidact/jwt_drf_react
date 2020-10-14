from django.contrib import admin
from django.urls import path, include  # add

urlpatterns = [
    path('admin/', admin.site.urls),

    # include user app urls
    path('users/', include('users.urls')),  # add

]
