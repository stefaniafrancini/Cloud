import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OutfitService } from '../../services/outfit.service';
import { GarmentService } from '../../services/garment.service';
import { Outfit } from '../../models/outfit.model';
import { Garment } from '../../models/garment.model';

@Component({
  standalone: true,
  selector: 'app-outfit-list',
  imports: [CommonModule],
  templateUrl: './outfit-list.component.html',
  styleUrls: ['./outfit-list.component.css']
})
export class OutfitListComponent implements OnInit {
  outfits: Outfit[] = [];
  allGarments: Garment[] = [];

  constructor(
    private outfitService: OutfitService,
    private garmentService: GarmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOutfits();
    this.loadGarments();
  }

  loadOutfits(): void {
    this.outfitService.getAll().subscribe((data) => {
      this.outfits = data;
    });
  }

  loadGarments(): void {
    this.garmentService.getAll().subscribe((data) => {
      this.allGarments = data;
    });
  }

  getGarmentNameById(id: number): string {
    const garment = this.allGarments.find(g => g.id === id);
    return garment ? garment.name : 'Desconocida';
  }

  deleteOutfit(id: number): void {
    if (confirm('¿Estás seguro que deseas eliminar este outfit?')) {
      this.outfitService.delete(id).subscribe(() => {
        this.loadOutfits();
      });
    }
  }

  verDetalle(outfit: Outfit): void {
    this.router.navigate(['/outfit', outfit.id]);
  }
}
