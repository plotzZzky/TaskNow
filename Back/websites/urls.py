from rest_framework.routers import DefaultRouter

from . import views

website_router = DefaultRouter()
website_router.register(r'websites', views.WebsiteView, basename='websites')
