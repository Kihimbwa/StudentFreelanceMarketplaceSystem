from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'title', 'budget', 'status', 'created_at']
