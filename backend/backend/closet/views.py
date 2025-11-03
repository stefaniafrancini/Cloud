from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Garment, Outfit, Folder
from .serializers import GarmentSerializer, OutfitSerializer, FolderSerializer

class GarmentViewSet(viewsets.ModelViewSet):
    queryset = Garment.objects.all()
    serializer_class = GarmentSerializer


class OutfitViewSet(viewsets.ModelViewSet):
    queryset = Outfit.objects.all()
    serializer_class = OutfitSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        garments = request.data.getlist('garments')
        if len(garments) < 2:
            return Response({'error': 'Debe seleccionar al menos 2 prendas.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def perform_create(self, serializer):
        name = serializer.validated_data.get('name', '')
        is_default = serializer.validated_data.get('is_default', False)

        # Verificamos si ya existe una carpeta default o llamada "Mi Ropero"
        if is_default or name.lower() == 'mi ropero':
            raise serializers.ValidationError("No se puede crear otra carpeta predeterminada.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        folder = self.get_object()
        if folder.is_default:
            return Response({'error': 'No se puede eliminar la carpeta predeterminada.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        # Buscar una carpeta por defecto, y si no existe, crearla
        default_folder = Folder.objects.filter(is_default=True).first()
        if not default_folder:
            default_folder = Folder.objects.create(name="Mi Ropero", is_default=True)

        default_folder.garments.set(Garment.objects.all())
        default_folder.outfits.set(Outfit.objects.all())
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def add_garment(self, request, pk=None):
        folder = self.get_object()
        garment_id = request.data.get('garment_id')
        garment = Garment.objects.get(id=garment_id)
        folder.garments.add(garment)
        return Response({'status': 'Prenda agregada a carpeta.'})

    @action(detail=True, methods=['post'])
    def add_outfit(self, request, pk=None):
        folder = self.get_object()
        outfit_id = request.data.get('outfit_id')
        outfit = Outfit.objects.get(id=outfit_id)
        folder.outfits.add(outfit)
        return Response({'status': 'Outfit agregado a carpeta.'})
