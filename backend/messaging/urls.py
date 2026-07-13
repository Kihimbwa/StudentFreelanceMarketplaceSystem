from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Hakikisha jina la ViewSet yako linaitwa hivi kwenye messaging/views.py
from .views import MessageViewSet 

router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]