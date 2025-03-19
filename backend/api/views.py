from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging
from .models import Note

logger = logging.getLogger(__name__)

class NoteListCreateView(generics.ListCreateAPIView):  # create a new note or list all notes
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # cannot call the API without being authenticated and providing the valid JWT

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):  # manually add the author field to the note because it's read only
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            logger.error(f"Invalid data: {serializer.errors}")
    
class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]   # Explicitly allow anyone to access this view
    authentication_classes = []       # No authentication required for registration

    def create(self, request, *args, **kwargs):
        logger.info(f"Registration request received")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            logger.info(f"Registration successful for user: {request.data.get('username')}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration failed: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
