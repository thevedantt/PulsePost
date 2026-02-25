"""
URL configuration for pulsepost_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to PulsePost API",
        "endpoints": {
            "tweets": "/api/tweets/",
            "auth": "/api/auth/",
            "profile": "/api/profile/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/', include('tweets.auth_urls')),

    # API endpoints for Tweets
    path('api/tweets/', include('tweets.urls')),

    # Profile endpoints
    path('api/profile/', include('tweets.profile_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
