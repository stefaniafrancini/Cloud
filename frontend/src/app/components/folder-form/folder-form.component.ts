import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';

@Component({
  standalone: true,
  selector: 'app-folder-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './folder-form.component.html',
  styleUrls: ['./folder-form.component.css']
})
export class FolderFormComponent {
  name = '';
  description = '';

  modalVisible = false;
  modalMessage = '';
  onModalCloseNavigate = false;

  constructor(private folderService: FolderService, private router: Router) {}

  mostrarModal(mensaje: string) {
    this.modalMessage = mensaje;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    if (this.onModalCloseNavigate) {
      this.router.navigate(['/carpetas']);
    }
  }

  save() {
    if (!this.name.trim()) {
      this.mostrarModal('Por favor, completá el nombre de la carpeta.');
      return;
    }

    const data = {
      name: this.name,
      description: this.description,
      is_default: false
    };

    this.folderService.create(data).subscribe(() => {
      this.mostrarModal('📁 ¡Carpeta creada con éxito!');
      this.onModalCloseNavigate = true;
    }, (error) => {
      console.error('Error al crear carpeta:', error);
      this.mostrarModal('Ocurrió un error al crear la carpeta. Intentalo de nuevo.');
    });
  }
}
