from django.urls import path
from .profile_views import MyProfileView, PublicProfileView, follow_user

urlpatterns = [
    # Own profile (auth required)
    path('me/', MyProfileView.as_view(), name='profile-me'),

    # Follow/Unfollow toggle (auth required)
    # Must be BEFORE the <str:username>/ catch-all route
    path('<str:username>/follow/', follow_user, name='follow-user'),

    # Public profile by username (open to everyone)
    path('<str:username>/', PublicProfileView.as_view(), name='profile-public'),
]
