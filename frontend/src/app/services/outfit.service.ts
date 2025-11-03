import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Outfit } from '../models/outfit.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  private apiUrl = 'http://localhost:8000/api/outfits/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Outfit[]> {
    return this.http.get<Outfit[]>(this.apiUrl);
  }

  get(id: number): Observable<Outfit> {
    return this.http.get<Outfit>(`${this.apiUrl}${id}/`);
  }

  create(data: FormData): Observable<Outfit> {
    return this.http.post<Outfit>(this.apiUrl, data);
  }

  update(id: number, data: FormData): Observable<Outfit> {
    return this.http.put<Outfit>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
