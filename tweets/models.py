from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tweet(models.Model):
    """
    Model representing a single tweet (post) in the PulsePost platform.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tweets")
    text = models.TextField()
    image = models.ImageField(upload_to="tweets/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] # Show newest tweets first by default

    def __str__(self):
        # Return a short preview of the tweet text along with the username
        return f"{self.user.username}: {self.text[:30]}..."
