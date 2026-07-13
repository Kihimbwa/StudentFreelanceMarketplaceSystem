# Kwenye messaging/views.py
from rest_framework import viewsets
from .models import Message  # au jina la model yako ya meseji
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet): # HAKIKISHA JINA NI HILI
    queryset = Message.objects.all()
    serializer_class = MessageSerializer