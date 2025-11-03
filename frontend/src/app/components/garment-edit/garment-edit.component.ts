import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GarmentService } from '../../services/garment.service';
import { Garment } from '../../models/garment.model';

@Component({
  standalone: true,
  selector: 'app-garment-edit',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './garment-edit.component.html',
  styleUrls: ['./garment-edit.component.css']
})
export class GarmentEditComponent implements OnInit {
  garment!: Garment;
  imageFile!: File;
  loading = true;
  showSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private garmentService: GarmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.garmentService.get(+id).subscribe((data) => {
        this.garment = data;
        this.loading = false;
      });
    }
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  save() {
    if (!this.garment.name || !this.garment.category || !this.garment.color) {
      alert('Completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.garment.name);
    formData.append('category', this.garment.category);
    formData.append('color', this.garment.color);

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.garmentService.update(this.garment.id!, formData).subscribe(() => {
      this.showSuccess = true;
    });
  }

  closeModal() {
    this.showSuccess = false;
    this.router.navigate(['/']);
  }
}
