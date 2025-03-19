from django.urls import path
from .views import NoteListCreateView, NoteDelete

urlpatterns = [
    path("notes/", NoteListCreateView.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", NoteDelete.as_view(), name="note-delete"),
]
