import { Component, OnInit } from '@angular/core';
import { GarmentService } from './services/garment.service';
import { Garment } from './models/garment.model';
import { OutfitService } from './services/outfit.service';
import { Outfit } from './models/outfit.model';
import { FolderService } from './services/folder.service';
import { Folder } from './models/folder.model';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit {
  title = 'front2';

  constructor(
    private garmentService: GarmentService,
    private outfitService: OutfitService,
    private folderService: FolderService
  ) {}

  ngOnInit(): void {
    this.garmentService.getAll().subscribe((garments: Garment[]) => {
      console.log('🎽 Prendas:', garments);
    });

    this.outfitService.getAll().subscribe((outfits: Outfit[]) => {
      console.log('👗 Outfits:', outfits);
    });

    this.folderService.getAll().subscribe((folders: Folder[]) => {
      console.log('🗂️ Carpetas:', folders);
    });
  }
}
