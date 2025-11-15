from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, serializers, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Garment, Outfit
from .serializers import GarmentSerializer, OutfitSerializer


# -------- Permiso: solo el dueño puede operar sobre el objeto --------
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        owner_id = getattr(obj, "owner_id", None)
        return owner_id is not None and owner_id == request.user.id


# -------- Mixin para forzar owner y filtrar por usuario --------
class OwnerViewSetMixin:
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ===== Garments =====
class GarmentViewSet(OwnerViewSetMixin, viewsets.ModelViewSet):
    queryset = Garment.objects.all()
    serializer_class = GarmentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# ===== Outfits =====
# Simplificado: dejamos que el serializer maneje M2M y validaciones.
class OutfitViewSet(OwnerViewSetMixin, viewsets.ModelViewSet):
    queryset = Outfit.objects.all()
    serializer_class = OutfitSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    u = request.user
    return Response({"id": u.id, "username": u.username, "email": u.email})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    email = (request.data.get("email") or "").strip().lower()

    if not username or not password:
        return Response(
            {"detail": "Username y password son obligatorios.",
            "code": "username_exists",  
            "field": "username",  },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username__iexact=username).exists():
        return Response(
            {"detail": "Ese usuario ya existe."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if email and User.objects.filter(email__iexact=email).exists():
        return Response(
            {"detail": "Ese email ya está registrado.",
            "code": "email_exists",     
            "field": "email",},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email or None,
        password=password
    )

    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    return Response(
        {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "access": str(access),
            "refresh": str(refresh),
        },
        status=status.HTTP_201_CREATED
    )
