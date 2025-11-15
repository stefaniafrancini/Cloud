import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

interface OutfitSuggestion {
  id: number;
  name: string;
  image: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text?: string;
  outfits?: OutfitSuggestion[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  isOpen = false;
  isLoading = false;
  userInput: string = '';

  // Datos que pide el backend
  sessionId: string = '';
  userId: number = 0;

  messages: ChatMessage[] = [
    { sender: 'bot', text: 'Hola 👋 ¿En qué puedo ayudarte?' }
  ];

  // Cambiá esta URL base si en local usás otra
  private outfitImageBaseUrl =
    'https://miropero-dzg4c8b4gyhxgca7.eastus-01.azurewebsites.net/';

  constructor(private chatbotService: ChatbotService) {
    // ------------------------------
    // 🔸 Session ID persistente
    // ------------------------------
    const existingSession = localStorage.getItem('chat_session_id');
    if (existingSession) {
      this.sessionId = existingSession;
    } else {
      const newId =
        (crypto as any)?.randomUUID?.() ??
        `session-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

      this.sessionId = newId;
      localStorage.setItem('chat_session_id', newId);
    }

    // ------------------------------
    // 🔸 Obtener user_id desde el JWT
    // ------------------------------
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Ajustá si tu JWT usa otro nombre (id, sub, etc.)
        this.userId = payload.user_id ?? payload.id ?? 0;

        console.log('🆔 userId para chatbot:', this.userId);
      } catch (e) {
        console.warn('⚠ No pude decodificar el token para userId');
        this.userId = 0;
      }
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

 

  getOutfitImageUrl(path: string): string {
  if (!path) return '';

  const baseUrl = 'http://127.0.0.1:8000/media/';

  const cleanPath = path.replace(/^\/+/, '');
  return baseUrl + cleanPath;
}







  sendMessage() {
    const text = this.userInput.trim();

    if (!text || this.isLoading) return;

    // Mostrar mensaje del usuario
    this.messages.push({ sender: 'user', text });

    this.userInput = '';
    this.isLoading = true;

    this.chatbotService.sendMessage(this.sessionId, this.userId, text).subscribe({
      next: (res) => {
        console.log('✅ Respuesta cruda del backend:', res);

        // texto principal
        const botText =
          res?.text ??
          res?.reply ??
          res?.output ??
          res?.response ??
          res?.message ??
          'Tengo una respuesta, pero no pude leer el texto.';

        // si vienen outfits, los agregamos
        if (res?.outfits && Array.isArray(res.outfits)) {
          const outfits: OutfitSuggestion[] = res.outfits.map((o: any) => ({
            id: o.id,
            name: o.name,
            image: o.image,
          }));

          this.messages.push({
            sender: 'bot',
            text: botText,
            outfits,
          });
        } else {
          // mensaje normal
          this.messages.push({
            sender: 'bot',
            text: botText,
          });
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.error('❌ Error llamando al chatbot:', err);

        this.messages.push({
          sender: 'bot',
          text:
            '😅 Hubo un problema al conectar con el asistente. Intentá más tarde.'
        });

        this.isLoading = false;
      }
    });
  }
}
