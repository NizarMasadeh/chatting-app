import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket: Socket | undefined;

  constructor(
    private _httpClient: HttpClient,
  ) {
    // this.socket = io(environment.apiUrl);

  }

  setUpSocket(): void {
    // const merchantId = localStorage.getItem('userId');

    // this.socket.on('messages', (res: any) => {
    //   console.log("Socket connected: ", res);

    // })
  }
  private getHeaders(): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4Y2VhYzk1OS04NGZmLTRmYzYtODM4ZS1jZDRlNzgzNWNiMzIiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDQxNjA4MCwiZXhwIjoxNzM3MDA4MDgwfQ.lusyiEOJcxZW_0thhsQGvGqSv2zvZcJBie-c7zY5yTg`,
    });

  }
  getUsers(): Observable<any> {
    return this._httpClient.get(`${environment.server}users?userType="Chat User"`, { headers: this.getHeaders() });
  }
}
