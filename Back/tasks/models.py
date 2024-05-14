from django.db import models
from projects.models import ProjectModel


class TaskModel(models.Model):
    project = models.ForeignKey(ProjectModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    desc = models.CharField()
    status = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)

    objects = models.Manager()


class CommentModel(models.Model):
    task = models.ForeignKey(TaskModel, on_delete=models.Model, related_name='comments')
    text = models.CharField()

    objects = models.Manager()
