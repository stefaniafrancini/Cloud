import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Ajustá la base según tu back
    private apiUrl = 'http://localhost:8000/api/auth/token';
    constructor(private http: HttpClient) { }

    // --- Auth endpoints básicos --
    login(username: string, password: string) {
        return this.http.post<{ access: string; refresh: string }>(
            'http://localhost:8000/api/auth/token/',
            { username, password }
        ).pipe(
            tap(res => localStorage.setItem('token', res.access))
        );
    }


    // opcional si tenés registro en el back
    register(payload: { username: string; email?: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}register/`, payload);
    }

    me(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}me/`, { headers: this.authHeaders() });
    }

    // --- Helpers de token ---
    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
    }

    // Headers con Authorization para reutilizar en otros services
    authHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    }
}
