import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  onRegister(registerData: any): Observable<any> {
    return this._httpClient.post(`${environment.server}auth/register`, registerData);
  }

  onLogin(loginData: any): Observable<any> {
    return this._httpClient.post(`${environment.server}auth/login`, loginData);
  }
}
