from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        # Tumebadilisha 'client' kuwa 'client_id' ili ilingane na model yako
        fields = ['id', 'client_id', 'title', 'description', 'budget', 'skills_required', 'status', 'created_at']
        read_only_fields = ['client_id']