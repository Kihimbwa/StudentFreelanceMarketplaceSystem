from rest_framework import serializers
from django.contrib.auth import get_user_model

# get_user_model inatafuta ile Custom User Model yetu tuliyoisajili kwenye settings.py
User = get_user_model()

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