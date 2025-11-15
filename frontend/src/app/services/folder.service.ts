import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Folder } from '../models/folder.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = 'https://cloud-2-i8un.onrender.com/api/folders/';

  constructor(private http: HttpClient) {}

  // 🔹 Función auxiliar para traer el token y generar los headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // se guarda al hacer login
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  getAll(): Observable<Folder[]> {
    return this.http.get<Folder[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  get(id: number): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  create(data: any): Observable<Folder> {
    return this.http.post<Folder>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  addGarment(folderId: number, garmentId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}${folderId}/add_garment/`,
      { garment_id: garmentId },
      { headers: this.getAuthHeaders() }
    );
  }

  addOutfit(folderId: number, outfitId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}${folderId}/add_outfit/`,
      { outfit_id: outfitId },
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, data: any): Observable<Folder> {
    return this.http.put<Folder>(`${this.apiUrl}${id}/`, data, { headers: this.getAuthHeaders() });
  }
}
