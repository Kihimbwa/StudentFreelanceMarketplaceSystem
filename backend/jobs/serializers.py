from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    # Tunamfanya mteja asionekane kwenye form ya kujaza, atajazwa kiotomatiki kutoka kwenye login session
    client_username = serializers.ReadOnlyField(source='client.username')

    class Meta:
        model = Job
        fields = ['id', 'client', 'client_username', 'title', 'description', 'budget', 'skills_required', 'status', 'created_at']
        read_only_fields = ['client']