from django.contrib.auth.models import User
from django.db import models


class BoardModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    desc = models.CharField()

    objects = models.Manager()
