from rest_framework import serializers
from django.contrib.auth import get_user_model
# Tunaagiza Serializer ya SimpleJWT kwa ajili ya kuifanyia mabadiliko
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# get_user_model inatafuta ile Custom User Model yetu tuliyoisajili kwenye settings.py
User = get_user_model()

# =====================================================================
# MPYA: Hii serializer itaweka 'role' na taarifa zingine ndani ya JWT Token
# =====================================================================
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Tunaongeza custom claims hapa ili React isome moja kwa moja
        token['role'] = getattr(user, 'role', 'student') 
        token['username'] = user.username
        token['email'] = user.email
        
        return token


# =====================================================================
# Serializer ya usajili iliyokuwepo (Haijabadika, imebaki salama kabisa)
# =====================================================================
class RegisterSerializer(serializers.ModelSerializer):
    # password iwe write_only=True ili isionekane kwenye majibu (JSON Response) baada ya usajili
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'phone_number')

    def create(self, validated_data):
        # create_user inatumika kusimbika (hash) password badala ya kuihifadhi kama plain text (usalama)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'student'),
            phone_number=validated_data.get('phone_number', '')
        )
        return user