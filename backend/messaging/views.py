from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Mtumiaji anaona tu meseji ambazo yeye ni mtumaji AU mpokeaji
        user_id = self.request.user.id
        return Message.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id)
        ).order_by('created_at')

    def perform_create(self, serializer):
        # Mtumiaji aliyelogin sasa hivi ndiye anayewekwa kama mtumaji (sender_id)
        serializer.save(sender_id=self.request.user.id)