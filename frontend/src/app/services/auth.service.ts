import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseAuthUrl = 'http://localhost:8000/api/auth/';

    constructor(private http: HttpClient) { }

    // --- LOGIN ---
    login(username: string, password: string) {
        return this.http.post<{ access: string; refresh: string }>(
            this.baseAuthUrl + 'token/',
            { username, password }
        ).pipe(
            tap(res => {
                localStorage.setItem('token', res.access);
                localStorage.setItem('refresh', res.refresh);
            })
        );
    }

    // --- REGISTER ---
    register(payload: { username: string; email?: string; password: string }) {
        return this.http.post<{
            user: { id: number; username: string; email: string | null };
            access: string;
            refresh: string;
        }>(
            this.baseAuthUrl + 'register/',
            payload
        ).pipe(
            tap(res => {
                // Opcional: loguear automáticamente después de registrarse
                if (res.access) {
                    localStorage.setItem('token', res.access);
                }
                if (res.refresh) {
                    localStorage.setItem('refresh', res.refresh);
                }
            })
        );
    }

    me(): Observable<any> {
        return this.http.get<any>(this.baseAuthUrl + 'me/', {
            headers: this.authHeaders()
        });
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

    authHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    }
}
