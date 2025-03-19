from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Note(models.Model):   # write the python version of the model and django will automatically convert it to a table in the database
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")  # one user can link to many notes. When we delete a user, all the notes associated with that user will also be deleted. Can access all the notes of a user by using the related_name "notes"
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
