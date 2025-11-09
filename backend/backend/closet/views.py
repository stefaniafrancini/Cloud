# app/views.py
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, serializers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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
        # Cada viewset define su model via .queryset.model o .serializer_class.Meta.model
        Model = getattr(self.queryset, "model", None) or getattr(self.serializer_class.Meta, "model", None)
        if Model is None:
            return super().get_queryset()
        return Model.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ===== Garments =====
class GarmentViewSet(OwnerViewSetMixin, viewsets.ModelViewSet):
    queryset = Garment.objects.all()
    serializer_class = GarmentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# ===== Outfits =====
class OutfitViewSet(OwnerViewSetMixin, viewsets.ModelViewSet):
    queryset = Outfit.objects.all()
    serializer_class = OutfitSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def _extract_id_list(self, request, key: str):
        """
        Soporta:
        - multipart/form-data -> request.data.getlist(key)
        - application/json -> list nativo
        - string "1,2,3" -> split
        - single value -> [value]
        """
        data = request.data
        if hasattr(data, "getlist"):
            ids = data.getlist(key)
            # Si viene como ['1,2,3'] lo partimos
            if len(ids) == 1 and isinstance(ids[0], str) and "," in ids[0]:
                ids = [x.strip() for x in ids[0].split(",") if x.strip()]
            return [int(x) for x in ids]

        raw = data.get(key, [])
        if isinstance(raw, list):
            return [int(x) for x in raw]
        if isinstance(raw, str):
            if "," in raw:
                return [int(x.strip()) for x in raw.split(",") if x.strip()]
            return [int(raw)]
        if raw is None:
            return []
        return [int(raw)]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        garment_ids = self._extract_id_list(request, "garments")
        if len(garment_ids) < 2:
            return Response({"error": "Debe seleccionar al menos 2 prendas."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que todas las prendas pertenezcan al usuario
        user_garments = Garment.objects.filter(owner=request.user, id__in=garment_ids)
        if user_garments.count() != len(set(garment_ids)):
            return Response({"error": "Hay prendas que no pertenecen al usuario."}, status=status.HTTP_400_BAD_REQUEST)

        response = super().create(request, *args, **kwargs)

        # Asignar M2M si el serializer no lo hizo automáticamente (según tu serializer)
        outfit_id = response.data.get("id")
        if outfit_id and garment_ids:
            outfit = Outfit.objects.get(id=outfit_id, owner=request.user)
            outfit.garments.set(user_garments)

        return response

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        # Permitir actualizar garments con las mismas validaciones
        garment_ids = self._extract_id_list(request, "garments")
        if garment_ids:
            if len(garment_ids) < 2:
                return Response({"error": "Debe seleccionar al menos 2 prendas."}, status=status.HTTP_400_BAD_REQUEST)
            user_garments = Garment.objects.filter(owner=request.user, id__in=garment_ids)
            if user_garments.count() != len(set(garment_ids)):
                return Response({"error": "Hay prendas que no pertenecen al usuario."}, status=status.HTTP_400_BAD_REQUEST)

        response = super().update(request, *args, **kwargs)

        if garment_ids:
            outfit = self.get_object()
            outfit.garments.set(user_garments)

        return response


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

    # ------ Acciones para agregar elementos con control de dueño ------
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
