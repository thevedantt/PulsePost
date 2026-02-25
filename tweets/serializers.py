from rest_framework import serializers
from .models import Tweet, TweetImage


class TweetImageSerializer(serializers.ModelSerializer):
    """
    Serializer for individual tweet images.
    Returns the full URL of the image so the frontend can render it directly.
    """
    image = serializers.ImageField()

    class Meta:
        model = TweetImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class TweetSerializer(serializers.ModelSerializer):
    """
    Main serializer for Tweet CRUD.

    READ  → returns nested list of image objects (id + url + created_at)
    WRITE → accepts multiple files via 'uploaded_images' key in multipart form data
    """
    # 'user' is read-only so it's not required in the POST body;
    # we'll set it automatically to the logged-in user in the view.
    user = serializers.ReadOnlyField(source='user.username')

    # READ: nested image serializer returns full image data
    images = TweetImageSerializer(many=True, read_only=True)

    # WRITE: accept multiple image files during creation
    # write_only=True means this field won't appear in GET responses
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False,  # Images are optional — a tweet can be text-only
    )

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'text', 'image', 'images', 'uploaded_images', 'created_at']
        # Keep legacy 'image' field readable for backward compatibility

    def create(self, validated_data):
        """
        Custom create to handle multi-image upload.
        1. Pop uploaded_images from validated data (not a model field)
        2. Create the Tweet
        3. Bulk-create TweetImage objects for each uploaded file
        """
        # Pop the uploaded images list (defaults to empty if none sent)
        uploaded_images = validated_data.pop('uploaded_images', [])

        # Create the tweet itself
        tweet = Tweet.objects.create(**validated_data)

        # Bulk create TweetImage entries for each uploaded file
        # Using list comprehension + bulk_create for efficiency (1 query instead of N)
        TweetImage.objects.bulk_create([
            TweetImage(tweet=tweet, image=img)
            for img in uploaded_images
        ])

        return tweet
