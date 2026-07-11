from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'job', 'freelancer', 'bid_amount', 'created_at']
    list_filter = ['created_at']
