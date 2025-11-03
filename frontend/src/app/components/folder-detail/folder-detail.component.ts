import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';

@Component({
  standalone: true,
  selector: 'app-folder-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit {
  folder!: Folder;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService
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

  // Desplaza el rail una tarjeta hacia la izquierda (-1) o derecha (1)
  scroll(railEl: HTMLElement | null, dir: 1 | -1): void {
    if (!railEl) return;
    const firstCard = railEl.querySelector<HTMLElement>('.card');
    const gap = parseFloat(getComputedStyle(railEl).gap || '0') || 0;
    const cardWidth = firstCard ? firstCard.clientWidth : 0;
    const delta = dir * (cardWidth + gap) * 1; // Cambiá *1 por *5 si querés avanzar 5 tarjetas
    railEl.scrollBy({ left: delta, behavior: 'smooth' });
  }
}
