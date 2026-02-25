from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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


class TweetImage(models.Model):
    """
    Stores individual images attached to a Tweet.
    One Tweet can have many TweetImages (Instagram-style multi-image support).
    """
    tweet = models.ForeignKey(
        Tweet,
        on_delete=models.CASCADE,
        related_name="images",  # Access via tweet.images.all()
    )
    image = models.ImageField(upload_to="tweets/")  # All tweet images go to media/tweets/
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for Tweet #{self.tweet.id} by {self.tweet.user.username}"


class Profile(models.Model):
    """
    User profile extending Django's built-in User model.
    Stores optional bio and avatar without modifying the User table.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, default="")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.username}"


class Follow(models.Model):
    """
    Represents a follow relationship between two users.
    follower = the user who is following
    following = the user being followed

    unique_together ensures a user can't follow the same person twice.
    """
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="following_set",  # user.following_set.all() → people I follow
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="follower_set",   # user.follower_set.all() → people who follow me
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent duplicate follows
        unique_together = ('follower', 'following')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.follower.username} → {self.following.username}"


# Signal: Auto-create a Profile whenever a new User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Signal: Save profile when user is saved (keeps them in sync)
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # get_or_create handles the case where older users don't have a profile yet
    Profile.objects.get_or_create(user=instance)
