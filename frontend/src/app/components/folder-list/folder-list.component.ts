import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';

@Component({
  standalone: true,
  selector: 'app-folder-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent implements OnInit {
  folders: Folder[] = [];
  editingMode = false; // ← para controlar visibilidad de los botones

  constructor(
    private folderService: FolderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.folderService.getAll().subscribe((data) => {
      // Ordenar: primero "Mi Ropero", luego las demás
      this.folders = data.sort((a, b) => {
        if (a.name === 'Mi Ropero') return -1;
        if (b.name === 'Mi Ropero') return 1;
        return 0;
      });
    });
  }

  deleteFolder(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta carpeta?')) {
      this.folderService.delete(id).subscribe(() => {
        this.loadFolders();
      });
    }
  }

  goToFolder(id: number): void {
    this.router.navigate(['/carpetas', id]);
  }

  toggleEditing(): void {
    this.editingMode = !this.editingMode;
  }
}
