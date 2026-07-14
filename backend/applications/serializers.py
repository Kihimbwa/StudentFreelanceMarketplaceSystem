from rest_framework import serializers
from .models import Application
from django.contrib.auth import get_user_model

User = get_user_model()

class ApplicationSerializer(serializers.ModelSerializer):
    job = serializers.IntegerField(source='job_id')
    freelancer_id = serializers.IntegerField(required=False)
    
    # Hapa tunatengeneza field mpya zitakazomsaidia Client kuona aliyeomba
    freelancer_username = serializers.SerializerMethodField()
    freelancer_email = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 
            'job', 
            'freelancer_id', 
            'freelancer_username', 
            'freelancer_email',
            'bid_amount', 
            'proposal', 
            'created_at'
        ]
        read_only_fields = ['freelancer_id', 'freelancer_username', 'freelancer_email']

    # Mbinu ya kupata jina la mtumiaji (username) kutoka kwenye Accounts Service / User Model
    def get_freelancer_username(self, obj):
        try:
            user = User.objects.get(id=obj.freelancer_id)
            return user.username
        except User.DoesNotExist:
            return "Unknown Student"

    # Mbinu ya kupata barua pepe (email)
    def get_freelancer_email(self, obj):
        try:
            user = User.objects.get(id=obj.freelancer_id)
            return user.email
        except User.DoesNotExist:
            return ""