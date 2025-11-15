import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Outfit } from '../models/outfit.model';

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  private apiUrl = 'https://cloud-2-i8un.onrender.com/api/outfits/';

  constructor(private http: HttpClient) {}

  // 🔹 Headers con token para cada request
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  getAll(): Observable<Outfit[]> {
    return this.http.get<Outfit[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  get(id: number): Observable<Outfit> {
    return this.http.get<Outfit>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  create(data: FormData): Observable<Outfit> {
    return this.http.post<Outfit>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: FormData): Observable<Outfit> {
    return this.http.put<Outfit>(`${this.apiUrl}${id}/`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }
}
