from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView

urlpatterns = [
    # Njia ya kusajili mtumiaji mpya
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Njia ya kulogin ili kupata Token (Access na Refresh Token)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Njia ya kuomba Access Token mpya pale ya zamani inapoisha muda wake (expire)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]