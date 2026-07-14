from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    # Tunapokea receiver kutoka React na kuifanya iende kwenye receiver_id
    receiver = serializers.IntegerField(source='receiver_id')
    sender_id = serializers.IntegerField(required=False)
    
    # Tunatengeneza field za ziada za kuonyesha majina ya wahusika
    sender_username = serializers.SerializerMethodField()
    receiver_username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 
            'sender_id', 
            'sender_username', 
            'receiver',  # React itatuma hii kama receiver
            'receiver_username', 
            'content', 
            'is_read', 
            'created_at'
        ]
        read_only_fields = ['sender_id', 'sender_username', 'receiver_username']

    def get_sender_username(self, obj):
        try:
            user = User.objects.get(id=obj.sender_id)
            return user.username
        except User.DoesNotExist:
            return "Mtumiaji Aliyefutwa"

    def get_receiver_username(self, obj):
        try:
            user = User.objects.get(id=obj.receiver_id)
            return user.username
        except User.DoesNotExist:
            return "Mtumiaji Aliyefutwa"