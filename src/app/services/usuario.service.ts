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
const clientIdGoogle = environment.clientIdGoogle;
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
    if(localStorage.getItem('token') && localStorage.getItem('user')){
      let USER = localStorage.getItem('user');
      
      this.usuario = JSON.parse(USER ? USER: '');
    }else{
      this.usuario = null;
    }
 }

  guardarLocalStorage(token: string, user:any, menu: any){
    localStorage.setItem('token', token);
    localStorage.setItem("user",JSON.stringify(user));
        localStorage.setItem('menu', JSON.stringify(menu));
  }


  googleInit(){

    return new Promise<void>((resolve) =>{

      gapi.load('auth2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id: clientIdGoogle,
          // client_id: '291137676127-svvuuca518djs47q2v78se9q6iggi4nq.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });


  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    localStorage.removeItem('user');


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
        const { first_name, last_name, pais, telefono, numdoc, email, local, img='', google, role, uid} = resp.usuario;

        this.usuario = new Usuario(first_name, last_name, pais, telefono, numdoc, email, local, '', img, google, role, uid);

        this.guardarLocalStorage(resp.token,resp.usuario, resp.menu);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios/registro`, formData)
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token,resp.usuario, resp.menu);
      })
    )
  }
  
  crearCliente(data: any){
    const url = `${base_url}/usuarios/registrocliente`;
    return this.http.post(url, data, this.headers);
  }

  actualizarPerfil(data:any,){

    return this.http.put(`${base_url}/usuarios/update/${this.uid}`, data, this.headers);
  }
  upadateUser(data: any, uid:any){
    let URL = base_url+"/usuarios/update/"+uid;
    return this.http.put(URL,data,this.headers);
  }


  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.usuario, resp.menu);
      })
    )
  }

  loginGoogle(token:string){
    return this.http.post(`${base_url}/login/google`, {token})
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.usuario, resp.menu);
      })
    )
  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`;
    console.log(url)
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
              user.local,
              user.lang,
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

  cargarUsuariosTienda(localId:string, desde: number = 0, ){

    const url = `${base_url}/usuarios/users_store/${desde}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map( resp =>{
          const tiendausers = resp.local.map(
            user => new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.telefono,
              user.numdoc,
              user.email,
              user.local,
              '', //password
               user.img,
              user.google,
              user.role,
              user.uid
              ));

          return {
            total: resp.total,
            tiendausers

          }
        })
      )
  }

  cargarEmployeesTienda(localId: string){
    const url = `${base_url}/usuarios/employe_store/${localId}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, local: Usuario[]}) => resp.local)
        );

  }
  cargarUsuariosAlmacen(desde: number = 0){

    const url = `${base_url}/usuarios/users_almacen?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp =>{
          const almacenusers = resp.almacenusers.map(
            user => new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.telefono,
              user.numdoc,
              user.email,
              '',
              user.local,
               user.img,
              user.google,
              user.role,
              user.uid
              ));

          return {
            total: resp.total,
            almacenusers

          }
        })
      )
  }
  cargarEmployeess(){

    const url = `${base_url}/usuarios/employees`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp =>{
          const employees = resp.employees.map(
            user => new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.telefono,
              user.numdoc,
              user.email,
              '',
              user.local,
               user.img,
              user.google,
              user.role,
              user.uid
              ));

          return {
            total: resp.total,
            employees

          }
        })
      )
  }
  cargarEmployees(desde: number = 0){

    const url = `${base_url}/usuarios/employees?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp =>{
          const employees = resp.employees.map(
            user => new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.telefono,
              user.numdoc,
              user.email,
              '',
              user.local,
               user.img,
              user.google,
              user.role,
              user.uid
              ));

          return {
            total: resp.total,
            employees

          }
        })
      )
  }
  cargarClients(desde: number = 0){

    const url = `${base_url}/usuarios/clients?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp =>{
          const clients = resp.clients.map(
            user => new Usuario(
              user.first_name,
              user.last_name,
              user.pais,
              user.telefono,
              user.numdoc,
              user.email,
              '',
              user.local,
               user.img,
              user.google,
              user.role,
              user.uid
              ));

          return {
            total: resp.total,
            clients

          }
        })
      )
  }


  borrarUsuario(usuario: any){
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers)
  }


  guardarUsuario(usuario: Usuario){
    return this.http.put(`${base_url}/usuarios/update/${usuario.uid}`, usuario, this.headers);
  }

  
  upadateStatusRole(data: any, uid:any){
    // return this.http.put(`${base_url}/usuarios/update/update/${usuario.uid}`, usuario, this.headers);

    let URL = base_url+"/usuarios/update/statusrole/"+uid;
    return this.http.put(URL,data,this.headers);
  }

  upadateLanguage(data: any, uid:any){
    let URL = base_url+"/usuarios/update/language/"+uid;
    return this.http.put(URL,data,this.headers);
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

  getClient(numdoc:number ){
    const url = `${base_url}/usuarios/numdoc/${numdoc}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, numdoc: Usuario}) => resp.numdoc)
        );
  }




}
