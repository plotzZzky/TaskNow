from rest_framework.routers import DefaultRouter

from . import views


boards_router = DefaultRouter()
boards_router.register(r'boards', views.BoardsView, basename='boards')
