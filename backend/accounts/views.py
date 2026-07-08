from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()

# generics.CreateAPIView ni view maalum ya Django REST inayoshughulikia POST requests za kusajili pekee
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # AllowAny inaruhusu mtu yeyote (hata asiyekuwa na akaunti) kuifikia API hii ili ajisajili
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer