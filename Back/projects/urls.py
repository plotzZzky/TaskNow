from rest_framework import routers
from .views import ProjectViewSet


projects_router = routers.DefaultRouter()
projects_router.register(r'projects', ProjectViewSet, basename='projects')
