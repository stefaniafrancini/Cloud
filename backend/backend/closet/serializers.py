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
    garments = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Garment.objects.all()
    )
    image = serializers.ImageField(required=False)

    class Meta:
        model = Outfit
        fields = ['id', 'owner', 'name', 'category', 'image', 'garments']

    def validate(self, data):
        garments = data.get('garments', [])
        if len(garments) < 2:
            raise serializers.ValidationError(
                {"error": "Debe seleccionar al menos 2 prendas."}
            )

        # Seguridad extra: asegurar que todas las prendas son del usuario
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            invalid = [g.id for g in garments if g.owner_id != request.user.id]
            if invalid:
                raise serializers.ValidationError(
                    {"error": "Hay prendas que no pertenecen al usuario."}
                )
        return data


# ---------- Folder ----------
class FolderSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    garments = GarmentSerializer(many=True, read_only=True)
    outfits = OutfitSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['id', 'owner', 'name', 'is_default', 'description', 'garments', 'outfits']

    def validate(self, data):
        name = (data.get('name') or '').strip().lower()
        is_default = data.get('is_default', False)
        if is_default or name == 'mi ropero':
            raise serializers.ValidationError("No se puede crear otra carpeta predeterminada.")
        return data
