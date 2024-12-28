import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _httpClient: HttpClient,
    private _router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  private getHeaders(): HttpHeaders {
    if (this.isBrowser) {
      const token = localStorage.getItem('userToken');
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  onRegister(registerData: any): Observable<any> {
    return this._httpClient.post(`${environment.server}auth/register`, registerData);
  }

  onLogin(loginData: any): Observable<any> {
    return this._httpClient.post(`${environment.server}auth/login`, loginData);
  }

  onLogout(): Observable<any> {
    return this._httpClient.post(`${environment.server}auth/logout`, {}, { headers: this.getHeaders() });
  }
}
