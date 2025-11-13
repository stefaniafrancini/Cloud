# app/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Garment(models.Model):
    CATEGORY_CHOICES = [
        ('camisa', 'Camisa'),
        ('pantalon', 'Pantalón'),
        ('zapato', 'Zapato'),
        ('accesorio', 'Accesorio'),
        ('vestido', 'Vestido'),
        ('pollera', 'Pollera'),
        ('remera', 'Remera'),
        ('shorts', 'Shorts'),
        ('buzo', 'Buzo'),
        ('top', 'Top'),
        ('zapatilla', 'Zapatilla'),
        ('botas', 'Botas'),
        ('otro', 'Otro'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='garments', null=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    color = models.CharField(max_length=50)
    image = models.ImageField(upload_to='garments/')

    class Meta:
        unique_together = [('owner', 'name')]
        indexes = [models.Index(fields=['owner', 'category'])]
        ordering = ['name']

    def __str__(self):
        return self.name


class Outfit(models.Model):
    OUTFIT_CATEGORY_CHOICES = [
        ('salir', 'Salir'),
        ('cena', 'Ir a cenar'),
        ('fiesta_elegante', 'Fiesta elegante'),
        ('fiesta_elegante_sport', 'Fiesta elegante sport'),
        ('trabajo', 'Trabajo'),
        ('oficina', 'Oficina'),
        ('cita', 'Cita'),
        ('playa', 'Playa'),
        ('evento_formal', 'Evento formal'),
        ('casual', 'Casual / Diario'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outfits', null=True)
    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=30,
        choices=OUTFIT_CATEGORY_CHOICES,
        default='casual',
    )
    image = models.ImageField(upload_to='outfits/', blank=True, null=True)
    garments = models.ManyToManyField(Garment, blank=True, related_name='outfits')

    class Meta:
        unique_together = [('owner', 'name')]
        ordering = ['name']

    def clean(self):
        if self.pk:
            for g in self.garments.all():
                if g.owner_id != self.owner_id:
                    raise ValidationError("Este outfit incluye prendas que no pertenecen al usuario.")

    def __str__(self):
        return self.name



class Folder(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders', null=True)
    name = models.CharField(max_length=100)
    garments = models.ManyToManyField(Garment, blank=True, related_name='folders')
    outfits = models.ManyToManyField(Outfit, blank=True, related_name='folders')
    is_default = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = [('owner', 'name')]
        ordering = ['name']

    def clean(self):
        # Evitar mezclar recursos de otros usuarios
        for g in self.garments.all():
            if g.owner_id != self.owner_id:
                raise ValidationError("La carpeta contiene prendas de otro usuario.")
        for o in self.outfits.all():
            if o.owner_id != self.owner_id:
                raise ValidationError("La carpeta contiene outfits de otro usuario.")

    def __str__(self):
        return self.name
