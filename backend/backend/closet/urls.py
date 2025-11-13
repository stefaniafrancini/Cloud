# app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GarmentViewSet, OutfitViewSet, FolderViewSet
from .views import me, register
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'garments', GarmentViewSet, basename='garment')
router.register(r'outfits', OutfitViewSet, basename='outfit')
router.register(r'folders', FolderViewSet, basename='folder')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),        
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),       
    path('auth/me/', me, name='me'),
    path('auth/register/', register, name='register'), 
]
