from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, serializers, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated

from .models import Garment, Outfit, Folder
from .serializers import GarmentSerializer, OutfitSerializer, FolderSerializer


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


# ===== Folders =====
def ensure_default_folder(user):
    """
    Crea (si no existe) la carpeta default **del usuario**.
    No toca su contenido para evitar efectos colaterales en GET /folders/.
    """
    folder, _ = Folder.objects.get_or_create(
        owner=user,
        is_default=True,
        defaults={"name": "Mi Ropero", "description": "Carpeta predeterminada"}
    )
    return folder


class FolderViewSet(OwnerViewSetMixin, viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request, *args, **kwargs):
        # Asegurar que el usuario tenga su carpeta default
        ensure_default_folder(request.user)
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        name = serializer.validated_data.get("name", "") or ""
        is_default = serializer.validated_data.get("is_default", False)

        # No permitir otra default por usuario ni que creen "Mi Ropero" manualmente
        if is_default or name.strip().lower() == "mi ropero":
            raise serializers.ValidationError("No se puede crear otra carpeta predeterminada.")

        # Única default por usuario
        if Folder.objects.filter(owner=self.request.user, is_default=True).exists() and is_default:
            raise serializers.ValidationError("Ya existe una carpeta predeterminada.")

        super().perform_create(serializer)

    def destroy(self, request, *args, **kwargs):
        folder = self.get_object()
        if folder.is_default:
            return Response({"error": "No se puede eliminar la carpeta predeterminada."},
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    # ------ Acciones para agregar/remover con control de dueño ------
    @action(detail=True, methods=["post"])
    def add_garment(self, request, pk=None):
        folder = self.get_object()  # ya verifica IsOwner
        garment_id = request.data.get("garment_id")
        if not garment_id:
            return Response({"error": "garment_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        garment = get_object_or_404(Garment, id=garment_id, owner=request.user)
        folder.garments.add(garment)
        return Response({"status": "Prenda agregada a la carpeta."})

    @action(detail=True, methods=["post"])
    def add_outfit(self, request, pk=None):
        folder = self.get_object()
        outfit_id = request.data.get("outfit_id")
        if not outfit_id:
            return Response({"error": "outfit_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        outfit = get_object_or_404(Outfit, id=outfit_id, owner=request.user)
        folder.outfits.add(outfit)
        return Response({"status": "Outfit agregado a la carpeta."})

    @action(detail=True, methods=["post"])
    def remove_garment(self, request, pk=None):
        folder = self.get_object()
        garment_id = request.data.get("garment_id")
        if not garment_id:
            return Response({"error": "garment_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        garment = get_object_or_404(Garment, id=garment_id, owner=request.user)
        folder.garments.remove(garment)
        return Response({"status": "Prenda removida de la carpeta."})

    @action(detail=True, methods=["post"])
    def remove_outfit(self, request, pk=None):
        folder = self.get_object()
        outfit_id = request.data.get("outfit_id")
        if not outfit_id:
            return Response({"error": "outfit_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        outfit = get_object_or_404(Outfit, id=outfit_id, owner=request.user)
        folder.outfits.remove(outfit)
        return Response({"status": "Outfit removido de la carpeta."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    u = request.user
    return Response({"id": u.id, "username": u.username, "email": u.email})
