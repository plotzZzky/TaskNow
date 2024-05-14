from django.db import models

from django.contrib.auth.models import User


class ContactModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    telephone = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=512)
    color = models.CharField(max_length=255)

    objects = models.Manager()
