import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';

@Component({
  standalone: true,
  selector: 'app-folder-edit',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.css']
})
export class FolderEditComponent implements OnInit {
  folder!: Folder;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.folderService.get(+id).subscribe((data) => {
        this.folder = data;
        this.loading = false;
      });
    }
  }

  save() {
    if (!this.folder.name) {
      alert('El nombre es obligatorio.');
      return;
    }

    this.folderService.update(this.folder.id!, {
      name: this.folder.name,
      description: this.folder.description,
      is_default: this.folder.is_default
    }).subscribe(() => {
      alert('Carpeta actualizada.');
      this.router.navigate(['/carpetas']);
    });
  }
}
