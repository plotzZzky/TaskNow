from rest_framework.serializers import ModelSerializer

from .models import TaskModel, CommentModel


class CommentSerializer(ModelSerializer):

    class Meta:
        model = CommentModel
        fields = '__all__'


class TaskSerializer(ModelSerializer):

    class Meta:
        model = TaskModel
        fields = ['id', 'title', 'desc', 'date', 'status']

