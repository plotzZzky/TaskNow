from rest_framework.serializers import ModelSerializer

from .models import ProjectModel


class ProjectSerializer(ModelSerializer):

    class Meta:
        model = ProjectModel
        fields = '__all__'
