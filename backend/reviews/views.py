from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Kila mtu anaweza kusoma, lakini kuandika lazima ulogin

    def perform_create(self, serializer):
        # Mtu aliyelogin ndio anakuwa reviewer kiotomatiki
        serializer.save(reviewer=self.request.user)
