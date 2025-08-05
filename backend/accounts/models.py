from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)

    def save(self, *args, **kwargs):
        self.is_staff = True
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    @property
    def is_instructor(self):
        return self.groups.filter(name='Instructor').exists()
