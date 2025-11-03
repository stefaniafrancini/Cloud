import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';

@Component({
  standalone: true,
  selector: 'app-assign-to-folder-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-to-folder-modal.component.html',
  styleUrls: ['./assign-to-folder-modal.component.css']
})
export class AssignToFolderModalComponent implements OnInit {
  @Input() itemId!: number;
  @Input() itemType!: 'garment' | 'outfit';
  @Output() closed = new EventEmitter<void>();

  folders: Folder[] = [];
  selectedFolderId!: number;

  showSuccess = false;
  successMessage = '';

  constructor(private folderService: FolderService) {}

  ngOnInit(): void {
    this.folderService.getAll().subscribe((data) => {
      this.folders = data;
    });
  }

  assign(): void {
    if (!this.selectedFolderId) {
      this.successMessage = 'Selecciona una carpeta.';
      this.showSuccess = true;
      return;
    }

    const callback = () => {
      this.successMessage =
        this.itemType === 'garment'
          ? 'Prenda añadida a la carpeta.'
          : 'Outfit añadido a la carpeta.';
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
        this.close();
      }, 2000);
    };

    if (this.itemType === 'garment') {
      this.folderService.addGarment(this.selectedFolderId, this.itemId).subscribe(callback);
    } else {
      this.folderService.addOutfit(this.selectedFolderId, this.itemId).subscribe(callback);
    }
  }

  close(): void {
    this.closed.emit();
  }
}
