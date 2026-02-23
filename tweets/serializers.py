from rest_framework import serializers
from .models import Tweet

class TweetSerializer(serializers.ModelSerializer):
    # 'user' is read-only so it's not required in the POST body; 
    # we'll set it automatically to the logged-in user in the view.
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'text', 'image', 'created_at']
