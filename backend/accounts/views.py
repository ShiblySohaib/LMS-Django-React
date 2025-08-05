

from django.contrib.auth import authenticate, login, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password

class LoginView(APIView):
    @method_decorator(csrf_exempt)
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            print(f"User {user.username} logged in successfully.")
            # Add is_superuser to response for role
            return Response({'success': True, 'username': user.username, 'role': 'admin' if user.is_superuser else 'instructor'})
        else:
            return Response({'success': False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
# User info API
from rest_framework.permissions import IsAuthenticated

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'role': 'admin' if user.is_superuser else 'instructor'
        })


# Signup API
class SignupView(APIView):
    @method_decorator(csrf_exempt)
    def post(self, request):
        User = get_user_model()
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        if not username or not password or not email:
            return Response({'success': False, 'error': 'Username, password, and email are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'success': False, 'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'success': False, 'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User(username=username, email=email, first_name=first_name, last_name=last_name)
        user.password = make_password(password)
        user.save()
        # Add user to Instructor group by default
        from django.contrib.auth.models import Group
        instructor_group, _ = Group.objects.get_or_create(name='Instructor')
        user.groups.add(instructor_group)
        return Response({'success': True, 'username': user.username})
