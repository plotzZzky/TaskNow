from rest_framework.routers import DefaultRouter

from . import views

notes_routers = DefaultRouter()
notes_routers.register(r'notes', views.NoteView, basename='notes')
