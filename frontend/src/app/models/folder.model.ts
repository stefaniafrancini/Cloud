import { Garment } from './garment.model';
import { Outfit } from './outfit.model';

export interface Folder {
  id?: number;
  name: string;
  description?: string;
  is_default: boolean;
  garments: Garment[];
  outfits: Outfit[];
}
