from django.urls import path
from .views import TweetListCreateView, TweetDetailView

urlpatterns = [
    path('', TweetListCreateView.as_view(), name='tweet-list-create'),
    path('<int:pk>/', TweetDetailView.as_view(), name='tweet-detail'),
]
