from rest_framework import status
from rest_framework.test import APITestCase

from .utils import generate_refresh_token,generate_access_token
from .models import User, RefreshToken
from .serializers import UserCreateSerializer

class UserViewsTest(APITestCase):
    
    @classmethod
    def setUpTestData(self):
        self.user = User.objects.create(
            username='testUser1',
            email='test@test.com',
            password='pass3412'
        )

        self.refresh_token = RefreshToken.objects.create(
            user=self.user,
            token = generate_refresh_token(self.user)
        )

    def test_can_register_user(self):
        credentials = {
            "username":"testUser1",
            "email":"test@test.com",
            "password":"pass3412",
            "password2":"pass3412"
        }
        
        response = self.client.post(
            'https://localhost:8000/users/',
            credentials
        )


        print(response.data)
