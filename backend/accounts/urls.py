from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
# Tunaagiza RegisterView na ile View yetu mpya ya Login (MyTokenObtainPairView)
from .views import RegisterView, MyTokenObtainPairView

urlpatterns = [
    # Njia ya kusajili mtumiaji mpya
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # MPYA: Njia ya kulogin inayotumia View yetu mpya ili kurudisha role ndani ya Token
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Njia ya kuomba Access Token mpya pale ya zamani inapoisha muda wake (expire)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]