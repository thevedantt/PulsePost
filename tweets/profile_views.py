from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.contrib.auth.models import User
from .models import Profile, Follow
from .profile_serializers import ProfileSerializer, PublicProfileSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/profile/me/  → View own profile
    PUT  /api/profile/me/  → Update own profile
    PATCH /api/profile/me/ → Partial update own profile

    Only authenticated users can access this.
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # get_or_create handles users that existed before Profile was added
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class PublicProfileView(generics.RetrieveAPIView):
    """
    GET /api/profile/<username>/  → View any user's public profile + their tweets

    Open to everyone (no auth required).
    Uses select_related/prefetch_related to avoid N+1 queries.
    """
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    def get_queryset(self):
        # Optimize: prefetch the user's tweets in one query
        return Profile.objects.select_related('user').prefetch_related('user__tweets')

    def get_object(self):
        username = self.kwargs['username']
        try:
            return self.get_queryset().get(user__username=username)
        except Profile.DoesNotExist:
            # If user exists but has no profile yet, create one
            try:
                user = User.objects.get(username=username)
                profile, _ = Profile.objects.get_or_create(user=user)
                return profile
            except User.DoesNotExist:
                raise NotFound(f"User '{username}' not found.")


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, username):
    """
    POST /api/profile/<username>/follow/

    Toggle follow: if already following → unfollow, otherwise → follow.
    Returns the new state so the frontend can update the button instantly.
    """
    # Find the user to follow
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {"error": f"User '{username}' not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Can't follow yourself
    if request.user == target_user:
        return Response(
            {"error": "You cannot follow yourself."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Toggle: if relationship exists → delete it (unfollow), otherwise → create it (follow)
    follow_obj, created = Follow.objects.get_or_create(
        follower=request.user,
        following=target_user,
    )

    if not created:
        # Already following → unfollow
        follow_obj.delete()
        return Response({
            "status": "unfollowed",
            "is_following": False,
            "follower_count": target_user.follower_set.count(),
        })

    # Just followed
    return Response({
        "status": "followed",
        "is_following": True,
        "follower_count": target_user.follower_set.count(),
    }, status=status.HTTP_201_CREATED)
