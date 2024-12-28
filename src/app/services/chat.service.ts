import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private isBrowser: boolean;

  private messageSubscription = new BehaviorSubject<any>(null);
  message$ = this.messageSubscription.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _httpClient: HttpClient,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getHeaders(): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4Y2VhYzk1OS04NGZmLTRmYzYtODM4ZS1jZDRlNzgzNWNiMzIiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDQxNjA4MCwiZXhwIjoxNzM3MDA4MDgwfQ.lusyiEOJcxZW_0thhsQGvGqSv2zvZcJBie-c7zY5yTg`,
    });

  }

  getMessages(): Observable<any> {
    return this._httpClient.get(`${environment.server}lamoor/messages`);
  }

  sendMessage(message: any): Observable<any> {
    return this._httpClient.post(`${environment.server}lamoor/messages`, message);
  }

  getUsers(): Observable<any> {
    return this._httpClient.get(`${environment.server}users?userType="Chat User"`, { headers: this.getHeaders() });
  }
}
