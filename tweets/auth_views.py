from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import status, views, permissions
from rest_framework.response import Response
from .auth_serializers import RegisterSerializer, LoginSerializer

class GetCSRFTokenView(views.APIView):
    """
    Endpoint to set the CSRF cookie on the frontend.
    The frontend must call this before making any POST/PUT/DELETE requests.
    The @ensure_csrf_cookie decorator forces Django to send the csrftoken cookie.
    """
    permission_classes = [permissions.AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({"message": "CSRF cookie set"})


class RegisterView(views.APIView):
    """
    View to register a new user.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": {
                    "username": serializer.data['username'],
                    "email": serializer.data.get('email', '')
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(views.APIView):
    """
    View to authenticate user and create a session.
    Also ensures the CSRF cookie is set on login response.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            
            if user:
                login(request, user)
                return Response({
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "username": user.username
                    }
                })
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    """
    View to log out user and clear session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})
