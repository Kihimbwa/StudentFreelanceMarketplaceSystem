from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
# Tunaongeza view ya SimpleJWT ya login na ile serializer yetu mpya
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer

User = get_user_model()

# =====================================================================
# MPYA: View ya Login inayoweka role, username, na email kwenye token
# =====================================================================
class MyTokenObtainPairView(TokenObtainPairView):
    # AllowAny inaruhusu mtu yeyote kujaribu kuingia (login)
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


# =====================================================================
# View ya Usajili (Imebaki salama kama ilivyokuwa)
# =====================================================================
# generics.CreateAPIView ni view maalum ya Django REST inayoshughulikia POST requests za kusajili pekee
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # AllowAny inaruhusu mtu yeyote (hata asiyekuwa na akaunti) kuifikia API hii ili ajisajili
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer