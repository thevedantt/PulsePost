from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Tweet
from .serializers import TweetSerializer
from .permissions import IsOwnerOrReadOnly

# Create your views here.


class TweetListCreateView(generics.ListCreateAPIView):
    """
    View to list all tweets (GET) and create a new tweet (POST).

    Uses prefetch_related('images') to avoid N+1 queries when serializing
    the nested TweetImage objects for each tweet in the list.

    Accepts multipart/form-data for image uploads.
    """
    # prefetch_related joins TweetImage in a single query instead of 1 per tweet
    queryset = Tweet.objects.prefetch_related('images').all()
    serializer_class = TweetSerializer
    # Support multipart uploads (images) alongside JSON
    parser_classes = [MultiPartParser, FormParser]

    # Allow any user to GET (list), but only authenticated users can POST (create)
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the tweet
        serializer.save(user=self.request.user)


class TweetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a single tweet.
    Permissions check if the user is the owner for PUT/PATCH/DELETE.

    Uses prefetch_related so the detail endpoint also returns images efficiently.
    """
    queryset = Tweet.objects.prefetch_related('images').all()
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
