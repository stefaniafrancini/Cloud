import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OutfitService } from '../../services/outfit.service';
import { GarmentService } from '../../services/garment.service';
import { Garment } from '../../models/garment.model';

@Component({
  standalone: true,
  selector: 'app-outfit-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './outfit-form.component.html',
  styleUrls: ['./outfit-form.component.css']
})
export class OutfitFormComponent implements OnInit {
  name = '';
  imageFile!: File;
  garments: Garment[] = [];
  selectedGarments: number[] = [];
  categorias: string[] = [];
  carouselIndex: { [key: string]: number } = {};
  collapsed: { [key: string]: boolean } = {};

  // ⭐ nuevo: categoría elegida para el outfit
  category: string = 'casual'; // debe coincidir con un choice del backend

  // ⭐ nuevo: listado de categorías posibles de outfit
  outfitCategories = [
    { value: 'salir', label: 'Salir' },
    { value: 'cena', label: 'Ir a cenar' },
    { value: 'fiesta_elegante', label: 'Fiesta elegante' },
    { value: 'fiesta_elegante_sport', label: 'Fiesta elegante sport' },
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'cita', label: 'Cita' },
    { value: 'playa', label: 'Playa' },
    { value: 'evento_formal', label: 'Evento formal' },
    { value: 'casual', label: 'Casual / Diario' },
  ];

  modalVisible = false;
  modalMessage = '';

  constructor(
    private outfitService: OutfitService,
    private garmentService: GarmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.garmentService.getAll().subscribe((data) => {
      this.garments = data;
      this.categorias = [...new Set(this.garments.map(g => g.category))];
      this.categorias.forEach(c => {
        this.carouselIndex[c] = 0;
        this.collapsed[c] = true;
      });
    });
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      if (!this.selectedGarments.includes(id)) {
        this.selectedGarments.push(id);
      }
    } else {
      this.selectedGarments = this.selectedGarments.filter(x => x !== id);
    }
  }

  getPrendasPorCategoria(categoria: string): Garment[] {
    return this.garments.filter(g => g.category === categoria);
  }

  retroceder(categoria: string): void {
    if (this.carouselIndex[categoria] >= 3) {
      this.carouselIndex[categoria] -= 3;
    }
  }

  avanzar(categoria: string): void {
    const total = this.getPrendasPorCategoria(categoria).length;
    if (this.carouselIndex[categoria] + 3 < total) {
      this.carouselIndex[categoria] += 3;
    }
  }

  toggleCategoria(categoria: string): void {
    this.collapsed[categoria] = !this.collapsed[categoria];
  }

  selectedCount(categoria: string): number {
    const idsCat = this.getPrendasPorCategoria(categoria).map(g => g.id);
    return this.selectedGarments.filter(id => idsCat.includes(id!)).length;
  }

  mostrarModal(mensaje: string) {
    this.modalMessage = mensaje;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  save() {
    if (!this.name.trim()) {
      this.mostrarModal('Por favor, completá el nombre del outfit.');
      return;
    }

    if (!this.imageFile) {
      this.mostrarModal('Seleccioná una imagen para el outfit.');
      return;
    }

    if (this.selectedGarments.length < 2) {
      this.mostrarModal('Seleccioná al menos 2 prendas para crear el outfit.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image', this.imageFile);

    // ⭐ nuevo: enviar categoría al backend
    formData.append('category', this.category);

    this.selectedGarments.forEach(id => {
      formData.append('garments', id.toString());
    });

    this.outfitService.create(formData).subscribe(() => {
      this.mostrarModal('¡Outfit creado con éxito!');
      setTimeout(() => this.router.navigate(['/outfits']), 2000);
    }, () => {
      this.mostrarModal('Ocurrió un error al crear el outfit.');
    });
  }

  getSelectedGarments(): Garment[] {
    return this.garments.filter(g => this.selectedGarments.includes(g.id!));
  }
}
