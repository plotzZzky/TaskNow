from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from django.conf import settings

from users.urls import user_router
from boards.urls import boards_router
from contacts.urls import contacts_router
from notes.urls import notes_routers
from projects.urls import projects_router
from tasks.urls import tasks_router
from websites.urls import website_router


urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include(user_router.urls)),
    path('', include(boards_router.urls)),
    path('', include(contacts_router.urls)),
    path('', include(notes_routers.urls)),
    path('', include(projects_router.urls)),
    path('', include(tasks_router.urls)),
    path('', include(website_router.urls)),
    path('media/<path:path>/', serve, {'document_root': settings.MEDIA_ROOT}),
]
