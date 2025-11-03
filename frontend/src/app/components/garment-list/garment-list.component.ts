import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GarmentService } from '../../services/garment.service';
import { Garment } from '../../models/garment.model';
import { AssignToFolderModalComponent } from '../assign-to-folder-modal/assign-to-folder-modal.component';

@Component({
  selector: 'app-garment-list',
  standalone: true,
  templateUrl: './garment-list.component.html',
  styleUrls: ['./garment-list.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, AssignToFolderModalComponent]
})
export class GarmentListComponent implements OnInit {
  garments: Garment[] = [];
  filteredGarments: Garment[] = [];

  searchTerm: string = '';
  showModal = false;
  selectedGarmentId!: number;
  showActions: boolean = false;

  showConfirm: boolean = false;
  garmentToDelete!: number;

  constructor(private garmentService: GarmentService) {}

  ngOnInit(): void {
    this.loadGarments();
  }

  loadGarments(): void {
    this.garmentService.getAll().subscribe((data: Garment[]) => {
      this.garments = data;
      this.filtrarPrendas();
    });
  }

  filtrarPrendas(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredGarments = this.garments.filter(g =>
      g.name.toLowerCase().includes(term)
    );
  }

  confirmDelete(id: number): void {
    this.garmentToDelete = id;
    this.showConfirm = true;
  }

  cancelDelete(): void {
    this.showConfirm = false;
  }

  deleteConfirmed(): void {
    this.garmentService.delete(this.garmentToDelete).subscribe(() => {
      this.loadGarments();
      this.showConfirm = false;
    });
  }

  openModal(id: number): void {
    this.selectedGarmentId = id;
    this.showModal = true;
  }

  toggleSelection(): void {
    this.showActions = !this.showActions;
  }
}
