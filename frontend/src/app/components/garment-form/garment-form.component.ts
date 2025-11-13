import { Component } from '@angular/core';
import { GarmentService } from '../../services/garment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 👈 Importá esto

@Component({
  selector: 'app-garment-form',
  standalone: true,
  imports: [FormsModule, CommonModule], // 👈 Agregalo acá también
  templateUrl: './garment-form.component.html',
  styleUrls: ['./garment-form.component.css']
})
export class GarmentFormComponent {
  name = '';
  category = '';
  color = '';
  imageFile: File | null = null;
  sending = false;

  // para mostrar la alerta
  showAlert = false;
  alertMessage = '';

  constructor(private garmentService: GarmentService) {}

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.imageFile = input.files && input.files.length ? input.files[0] : null;
  }

  save() {
    // Validar campos requeridos
    if (!this.name || !this.category || !this.color) {
      this.alertMessage = 'Por favor, completá todos los campos: nombre, categoría y color.';
      this.showAlert = true;
      return;
    }

    console.log('submit', { name: this.name, category: this.category, color: this.color, image: this.imageFile });
    const fd = new FormData();
    fd.append('name', this.name);
    fd.append('category', this.category);
    fd.append('color', this.color);
    if (this.imageFile) fd.append('image', this.imageFile);

    this.sending = true;
    this.garmentService.create(fd).subscribe({
      next: (res) => {
        console.log('✅ creada', res);
        this.sending = false;
        window.location.href = '/prendas';
      },
      error: (err) => {
        console.error('❌ error POST', err);
        alert('Error POST: ' + (err?.status || ''));
        this.sending = false;
      },
    });
  }

  closeAlert() {
    this.showAlert = false;
  }
}
