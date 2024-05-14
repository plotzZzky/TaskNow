from rest_framework.serializers import ModelSerializer

from .models import ContactModel


class ContactSerializer(ModelSerializer):
    class Meta:
        model = ContactModel
        fields = '__all__'
