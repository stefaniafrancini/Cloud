import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Folder } from '../models/folder.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = 'http://localhost:8000/api/folders/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Folder[]> {
    return this.http.get<Folder[]>(this.apiUrl);
  }

  get(id: number): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}${id}/`);
  }

  create(data: any): Observable<Folder> {
    return this.http.post<Folder>(this.apiUrl, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  addGarment(folderId: number, garmentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${folderId}/add_garment/`, {
      garment_id: garmentId
    });
  }

  addOutfit(folderId: number, outfitId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${folderId}/add_outfit/`, {
      outfit_id: outfitId
    });
  }

  update(id: number, data: any): Observable<Folder> {
  return this.http.put<Folder>(`${this.apiUrl}${id}/`, data);
}

}
