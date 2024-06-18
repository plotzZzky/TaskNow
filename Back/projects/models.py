from django.contrib.auth.models import User
from django.db import models


class ProjectModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    desc = models.CharField(blank=True)

    objects = models.Manager()
