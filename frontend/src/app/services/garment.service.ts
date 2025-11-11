import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Garment } from '../models/garment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GarmentService {
  private apiUrl = 'http://localhost:8000/api/garments/';

  constructor(private http: HttpClient) {}

  // 🔹 Headers con token para cada request
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  getAll(): Observable<Garment[]> {
    return this.http.get<Garment[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  get(id: number): Observable<Garment> {
    return this.http.get<Garment>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  create(data: FormData): Observable<Garment> {
    return this.http.post<Garment>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: FormData): Observable<Garment> {
    return this.http.put<Garment>(`${this.apiUrl}${id}/`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }
}
