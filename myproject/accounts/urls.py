from django.urls import path
from .views import RegisterView, LoginView, CheckTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
]
