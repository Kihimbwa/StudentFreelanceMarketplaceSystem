from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'reviewer_id', 'reviewee_id', 'job_id', 'rating', 'created_at')