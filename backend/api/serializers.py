from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note
import logging

logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    # convert the User model into a JSON format
    class Meta:
        model = User
        fields = ["id", "username", "password"]   # check if this is correct and valid first
        extra_kwargs = {"password": {"write_only": True}}   

    def create(self, validated_data):
        logger.info(f"Creating user with data: {validated_data}")
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password']
            )
            logger.info(f"Successfully created user: {user.username}")
            return user
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "updated_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}  # we can only read because we're not creating a new note nor a author

    def create(self, validated_data):
        logger.info(f"Creating note with data: {validated_data}")
        try:
            note = Note.objects.create(**validated_data)
            logger.info(f"Successfully created note: {note.title}")
            return note
        except Exception as e:
            logger.error(f"Error creating note: {str(e)}")
            raise

