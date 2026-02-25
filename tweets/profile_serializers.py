from rest_framework import serializers
from .models import Profile, Follow
from .serializers import TweetSerializer


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model (own profile — /api/profile/me/).
    Exposes username and email from the related User (read-only)
    and allows editing bio and avatar.
    Also includes follower/following counts.
    """
    # Pull user fields as read-only (don't allow changing username/email via profile)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    # Follow counts — computed from the Follow model
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'email', 'bio', 'avatar',
            'follower_count', 'following_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_follower_count(self, obj):
        """How many people follow this user."""
        return obj.user.follower_set.count()

    def get_following_count(self, obj):
        """How many people this user follows."""
        return obj.user.following_set.count()


class PublicProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for public profile view (/api/profile/<username>/).
    Includes user's tweets, follow counts, and whether the
    currently logged-in user is following this profile.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    tweets = TweetSerializer(source='user.tweets', many=True, read_only=True)
    tweet_count = serializers.SerializerMethodField()

    # Follow stats
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    # Whether the currently logged-in user follows this profile
    # This lets the frontend show "Follow" vs "Following" button
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'bio', 'avatar', 'created_at',
            'tweets', 'tweet_count',
            'follower_count', 'following_count', 'is_following',
        ]

    def get_tweet_count(self, obj):
        return obj.user.tweets.count()

    def get_follower_count(self, obj):
        """How many people follow this user."""
        return obj.user.follower_set.count()

    def get_following_count(self, obj):
        """How many people this user follows."""
        return obj.user.following_set.count()

    def get_is_following(self, obj):
        """
        Check if the request user follows this profile's user.
        Returns False for anonymous/unauthenticated users.
        """
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        # Don't show follow button for own profile
        if request.user == obj.user:
            return None  # null = "this is you"
        return Follow.objects.filter(
            follower=request.user,
            following=obj.user,
        ).exists()
