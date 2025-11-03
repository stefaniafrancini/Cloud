from rest_framework import serializers
from .models import Garment, Outfit, Folder

class GarmentSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Garment
        fields = '__all__'


class OutfitSerializer(serializers.ModelSerializer):
    garments = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Garment.objects.all()
    )
    image = serializers.ImageField(required=False)

    class Meta:
        model = Outfit
        fields = '__all__'

    def validate(self, data):
        garments = data.get('garments', [])
        if len(garments) < 2:
            raise serializers.ValidationError({"error": "Debe seleccionar al menos 2 prendas."})
        return data



class FolderSerializer(serializers.ModelSerializer):
    garments = GarmentSerializer(many=True, read_only=True)
    outfits = OutfitSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['id', 'name', 'is_default', 'description','garments', 'outfits']
