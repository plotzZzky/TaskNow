from rest_framework import routers

from .views import TaskViewSet, CommentViewSet


tasks_router = routers.DefaultRouter()
tasks_router.register(r'tasks', TaskViewSet, basename='tasks')
tasks_router.register(r'comments', CommentViewSet, basename='comments')
