from django.urls import path
from .auth_views import RegisterView, LoginView, LogoutView, GetCSRFTokenView

urlpatterns = [
    path('csrf/', GetCSRFTokenView.as_view(), name='auth-csrf'),
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
]
