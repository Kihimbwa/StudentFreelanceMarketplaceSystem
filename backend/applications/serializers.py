from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    freelancer_username = serializers.ReadOnlyField(source='freelancer.username')

    class Meta:
        model = Application
        fields = ['id', 'job', 'freelancer', 'freelancer_username', 'bid_amount', 'proposal', 'created_at']
        read_only_fields = ['freelancer']