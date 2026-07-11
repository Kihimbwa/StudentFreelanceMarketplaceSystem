from rest_framework import viewsets, permissions
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Mwanafunzi aliyelogin ndiye anayewekwa kiotomatiki kama muombaji
        serializer.save(freelancer=self.request.user)