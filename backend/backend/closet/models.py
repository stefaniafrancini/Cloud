from django.db import models

class Garment(models.Model):
    CATEGORY_CHOICES = [
        ('camisa', 'Camisa'),
        ('pantalon', 'Pantalón'),
        ('zapato', 'Zapato'),
        ('accesorio', 'Accesorio'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    color = models.CharField(max_length=50)
    image = models.ImageField(upload_to='garments/')

    def __str__(self):
        return self.name

class Outfit(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='outfits/', blank=True, null=True)
    garments = models.ManyToManyField(Garment)

    def __str__(self):
        return self.name

class Folder(models.Model):
    name = models.CharField(max_length=100)
    garments = models.ManyToManyField(Garment, blank=True)
    outfits = models.ManyToManyField(Outfit, blank=True)
    is_default = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
