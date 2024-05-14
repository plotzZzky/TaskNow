from rest_framework.routers import DefaultRouter

from . import views


contacts_router = DefaultRouter()
contacts_router.register(r'contacts', views.ContactView, basename='contacts')
