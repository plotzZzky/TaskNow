from django.db import models

from boards.models import BoardModel


class NotesModel(models.Model):
    board = models.ForeignKey(BoardModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    desc = models.CharField(max_length=2048)
    date = models.DateField()
    color = models.CharField(max_length=255)

    objects = models.Manager()
