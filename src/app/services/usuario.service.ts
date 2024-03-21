import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { RegisterForm } from '../auth/interfaces/register-form.interface';
import { LoginForm } from '../auth/interfaces/login-form.interface';
import { CargarUsuario } from '../auth/interfaces/cargar-usuarios.interface';

import {tap, map, catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.baseUrl;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
    ) {
      this.googleInit();
  }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN' | 'USER' | 'VENTAS' | 'TIENDA' | 'ALMACEN'{
    return this.usuario.role!;
  }

  get uid():string{
    return this.usuario.uid || '';
  }

  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }

  getLocalStorage(){
    localStorage.getItem('token')
        
  }

  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);
        localStorage.setItem('menu', JSON.stringify(menu));
  }


  googleInit(){

    return new Promise<void>((resolve) =>{

      gapi.load('auth2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id: '291137676127-svvuuca518djs47q2v78se9q6iggi4nq.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });


  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');


    this.auth2.signOut().then(()=>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })

    })
    window.location.reload();
  }

  validarToken(): Observable<boolean>{

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { first_name, last_name, pais, telefono, numdoc, email, img='', google, role, uid} = resp.usuario;

        this.usuario = new Usuario(first_name, last_name, pais, telefono, numdoc, email, '', img, google, role, uid);

        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios/registro`, formData)
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    )
  }

  actualizarPerfil(data: {email: string, nombre: string, role?: string}){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }


  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    )
  }

  loginGoogle(token:string){
    return this.http.post(`${base_url}/login/google`, {token})
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    )
  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp =>{
          const usuarios = resp.usuarios.map(
            user => new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.telefono,
              user.numdoc,
              user.email,
              '',
               user.img,
              user.google,
              user.role,
              user.uid
              ));

          return {
            total: resp.total,
            usuarios

          }
        })
      )
  }


  borrarUsuario(usuario: any){
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers)
  }


  guardarUsuario(usuario: Usuario){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }


  get_user(usuario:Usuario):Observable<any>{
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.get(url, this.headers)
  }

  getUserById(_id: string){
    const url = `${base_url}/usuarios/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, usuario: Usuario}) => resp.usuario)
        );

  }

  get_user_data():Observable<any>{
    const url = `${base_url}/usuarios`;
    return this.http.get(url, this.headers)
  }

  getUsers(){

    const url = `${base_url}/usuarios`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, usuarios: Usuario[]}) => resp.usuarios)
      )

  }




}
