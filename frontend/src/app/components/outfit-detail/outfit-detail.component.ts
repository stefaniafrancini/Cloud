import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OutfitService } from '../../services/outfit.service';
import { GarmentService } from '../../services/garment.service';
import { Outfit } from '../../models/outfit.model';
import { Garment } from '../../models/garment.model';

@Component({
  standalone: true,
  selector: 'app-outfit-detail',
  templateUrl: './outfit-detail.component.html',
  styleUrls: ['./outfit-detail.component.css'],
  imports: [CommonModule]
})
export class OutfitDetailComponent implements OnInit {

  outfit?: Outfit;
  allGarments: Garment[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private outfitService: OutfitService,
    private garmentService: GarmentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.outfitService.get(id).subscribe((data) => {
      this.outfit = data;
    });

    this.garmentService.getAll().subscribe((data) => {
      this.allGarments = data;
    });
  }

  getGarmentNameById(id: number): string {
    const garment = this.allGarments.find(g => g.id === id);
    return garment ? garment.name : 'Desconocida';
  }

  getGarmentById(id: number): Garment | undefined {
  return this.allGarments.find(g => g.id === id);
}

  volver(): void {
    this.router.navigate(['/outfits']);
  }
}
