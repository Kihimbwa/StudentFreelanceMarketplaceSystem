from rest_framework import viewsets, permissions
from .models import Job
from .serializers import JobSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    # Mtu yeyote anaweza kuona kazi, lakini kupost/kufuta lazima awe na akaunti (Token)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Inachukua mtumiaji aliyepiga API kwa sasa na kumfanya ndio Client wa hii kazi
        serializer.save(client=self.request.user)