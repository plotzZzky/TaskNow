from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Recovery


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class RecoverySerializer(ModelSerializer):
    class Meta:
        model = Recovery
        fields = '__all__'
