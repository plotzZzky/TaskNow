from django.db import models

from django.contrib.auth.models import User


class WebsiteModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    url = models.CharField(max_length=2048)
    color = models.CharField(max_length=255)

    objects = models.Manager()
