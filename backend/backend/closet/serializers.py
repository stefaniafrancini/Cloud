from rest_framework import serializers
from .models import Garment, Outfit

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


