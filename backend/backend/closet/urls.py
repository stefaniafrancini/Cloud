from django.urls import path, include
from rest_framework import routers
from .views import GarmentViewSet, OutfitViewSet, FolderViewSet

router = routers.DefaultRouter()
router.register(r'garments', GarmentViewSet)
router.register(r'outfits', OutfitViewSet)
router.register(r'folders', FolderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
