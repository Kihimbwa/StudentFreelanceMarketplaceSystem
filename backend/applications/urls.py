from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet

router = DefaultRouter()
# Hapa tumeweka tupu r'' ili link iwe /api/applications/ moja kwa moja
router.register(r'', ApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
]