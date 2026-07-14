from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    # Tunapokea vyote viwili ili kuruhusu React kutuma 'receiver' au 'receiver_id'
    receiver = serializers.IntegerField(write_only=True, required=False)
    receiver_id = serializers.IntegerField(write_only=True, required=False)
    
    # Hizi ni kwa ajili ya kurudisha data kwenda React (GET)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True, default="Mtumiaji Aliyefutwa")
    partner_receiver_id = serializers.IntegerField(source='receiver.id', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True, default="Mtumiaji Aliyefutwa")

    class Meta:
        model = Message
        fields = [
            'id', 
            'sender_id', 
            'sender_username', 
            'receiver',          # Inatumika kwenye JobDetailsPage
            'receiver_id',       # Inatumika kwenye MessagesPage (Request & Response)
            'partner_receiver_id',
            'receiver_username', 
            'content', 
            'is_read', 
            'created_at'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        sender = request.user if request else None
        
        # Kupata sender_id kutoka kwa views.py au request.user
        sender_id = validated_data.pop('sender_id', None) or (sender.id if sender else None)
        
        if not sender_id:
            raise serializers.ValidationError("Mtumiaji lazima awe amejisajili ili kutuma ujumbe.")

        # Tunachukua aidha 'receiver' au 'receiver_id' kutoka kwenye data iliyotumwa na React
        receiver_id = validated_data.pop('receiver', None) or validated_data.pop('receiver_id', None)

        if not receiver_id:
            raise serializers.ValidationError({"receiver": "Mpokeaji wa ujumbe anahitajika."})

        # Hakikisha mpokeaji yupo
        if not User.objects.filter(id=receiver_id).exists():
            raise serializers.ValidationError({"receiver": "Mpokeaji wa ujumbe hajapatikana."})

        return Message.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            **validated_data
        )

    def to_representation(self, instance):
        # Hapa tunahakikisha kuwa React inapata 'receiver_id' kama ilivyozoea
        data = super().to_representation(instance)
        data['receiver_id'] = instance.receiver_id
        return data