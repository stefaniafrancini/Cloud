import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Garment } from '../models/garment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GarmentService {
  private apiUrl = 'http://localhost:8000/api/garments/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Garment[]> {
    return this.http.get<Garment[]>(this.apiUrl);
  }

  get(id: number): Observable<Garment> {
    return this.http.get<Garment>(`${this.apiUrl}${id}/`);
  }

  create(data: FormData): Observable<Garment> {
    return this.http.post<Garment>(this.apiUrl, data);
  }

  update(id: number, data: FormData): Observable<Garment> {
    return this.http.put<Garment>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
