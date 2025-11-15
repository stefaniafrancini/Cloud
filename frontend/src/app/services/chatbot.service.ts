import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = 'https://miropero-dzg4c8b4gyhxgca7.eastus-01.azurewebsites.net/api/chat';

  constructor(private http: HttpClient) {}

  // 👇 ahora le pasamos sessionId y userId
  sendMessage(sessionId: string, userId: number, message: string): Observable<any> {
    const body = {
      message: message,
      session_id: sessionId,
      user_id: userId,
    };

    console.log('📤 Enviando al backend:', body);

    return this.http.post<any>(this.apiUrl, body);
  }
}
