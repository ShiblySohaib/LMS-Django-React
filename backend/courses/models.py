from django.db import models
from accounts.models import CustomUser

class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(Timestamp):
    name = models.CharField(max_length=100, unique=True, null=False, blank=False)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name



class Course(Timestamp):
    title = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses')

    def __str__(self):
        return self.title


# Enrollment model
class Enrollment(Timestamp):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    instructor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='enrollments')

    class Meta:
        unique_together = ('course', 'instructor')

    def __str__(self):
        return f"{self.instructor.username} assigned to {self.course.title}"

