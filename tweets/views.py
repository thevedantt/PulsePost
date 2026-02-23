from rest_framework import generics, permissions
from .models import Tweet
from .serializers import TweetSerializer
from .permissions import IsOwnerOrReadOnly

# Create your views here.

class TweetListCreateView(generics.ListCreateAPIView):
    """
    View to list all tweets (GET) and create a new tweet (POST).
    """
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    
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
    """
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
