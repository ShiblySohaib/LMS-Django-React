from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from .models import Category, Course, Enrollment
from .serializers import CategorySerializer, InstructorSerializer, CourseSerializer, EnrollmentSerializer
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Only allow access if authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        # Admins can do anything
        if request.user.is_staff:
            return True
        # Non-admins: only allow safe methods (read-only)
        return request.method in SAFE_METHODS

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class InstructorViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(groups__name='Instructor')
    serializer_class = InstructorSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
