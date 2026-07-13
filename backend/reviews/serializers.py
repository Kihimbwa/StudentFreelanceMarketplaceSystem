from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    # Hizi zinasaidia kuonyesha majina ya watu badala ya ID tu (optional lakini inavutia)
    reviewer_name = serializers.ReadOnlyField(source='reviewer.username')
    reviewee_name = serializers.ReadOnlyField(source='reviewee.username')

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'reviewer_name', 'reviewee', 'reviewee_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer']