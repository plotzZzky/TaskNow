from django.contrib import admin

from .models import TaskModel, CommentModel

admin.site.register(TaskModel)
admin.site.register(CommentModel)
