import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

//Eviroment
import { environment } from '../../environments/environment';
import { PasswordForm } from '../auth/interfaces/password-form.interface';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  serverUrl = environment.baseUrl;
  isLoggedIn = false;

  public error = null;

  public user;




  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.user;
  }

  get token(): string {
    return localStorage.getItem('auth_token') || '';
  }

  get role(): 'SUPERADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST' {
    return this.user.role!;
  }



  get headers() {
    return {
      headers: {
        'auth_token': this.token
      }
    }
  }

  getToken() {
    const token = localStorage.getItem('auth_token');
    return this.token;
  }


  forgotPassword(formData: any) {
    return this.http.post(`${this.serverUrl}/login/forgot-password`, formData)

  }

  changePassword(formData: any) {
    return this.http.post(`${this.serverUrl}/login/change-forgot-password`, formData)

  }

  resetPassword(formData: PasswordForm) {
    return this.http.post(`${this.serverUrl}/login/reset-password`, formData)

  }
  newPassword(formData: PasswordForm) {
    return this.http.post(`${this.serverUrl}/login/change-password`, formData)

  }


}
