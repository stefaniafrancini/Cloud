# app/serializers.py
from rest_framework import serializers
from .models import Garment, Outfit, Folder

# ---------- Garment ----------
class GarmentSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Garment
        fields = ['id', 'owner', 'name', 'category', 'color', 'image']


# ---------- Outfit ----------
class OutfitSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    # El queryset se setea dinámicamente en __init__ para filtrar por el usuario
    garments = serializers.PrimaryKeyRelatedField(many=True, queryset=Garment.objects.none())
    image = serializers.ImageField(required=False)

    class Meta:
        model = Outfit
        fields = ['id', 'owner', 'name', 'image', 'garments']

    def __init__(self, *args, **kwargs):
        """
        Filtra las prendas disponibles a las del usuario autenticado.
        Necesario para el Browsable API y para validaciones automáticas.
        """
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            self.fields['garments'].queryset = Garment.objects.filter(owner=request.user)

    def validate(self, data):
        garments = data.get('garments', [])
        if len(garments) < 2:
            raise serializers.ValidationError({"error": "Debe seleccionar al menos 2 prendas."})

        # Seguridad extra: asegurar que todas las prendas son del usuario
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            invalid = [g.id for g in garments if g.owner_id != request.user.id]
            if invalid:
                raise serializers.ValidationError({"error": "Hay prendas que no pertenecen al usuario."})
        return data


# ---------- Folder ----------
class FolderSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    # Lectura anidada (read-only). La escritura se hace por actions: add_garment / add_outfit
    garments = GarmentSerializer(many=True, read_only=True)
    outfits = OutfitSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['id', 'owner', 'name', 'is_default', 'description', 'garments', 'outfits']

    def validate(self, data):
        """
        Evita que se intente crear/editar otra default desde el serializer directamente.
        La lógica principal está en la view, pero esto agrega una red extra.
        """
        name = (data.get('name') or '').strip().lower()
        is_default = data.get('is_default', False)
        if is_default or name == 'mi ropero':
            # La creación de la default se maneja automáticamente por view (ensure_default_folder)
            raise serializers.ValidationError("No se puede crear otra carpeta predeterminada.")
        return data
