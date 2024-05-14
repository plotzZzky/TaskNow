from rest_framework.serializers import ModelSerializer

from .models import WebsiteModel


class WebSiteSerializer(ModelSerializer):
    class Meta:
        model = WebsiteModel
        fields = '__all__'

