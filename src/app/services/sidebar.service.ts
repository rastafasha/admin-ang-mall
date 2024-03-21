import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];
  }

  /*menu: any[] = [
    {
      titulo: 'Menu desde sidebarService',
      icono: 'mdi mdi-gauge',
      submenu:[
        {titulo: 'Main', url:'/'},
        {titulo: 'progressBar', url:'progress'},
        {titulo: 'Donas', url:'grafica1'},
        {titulo: 'Promesas', url:'promesas'},
        {titulo: 'Rxjs', url:'rxjs'},
      ]
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-folder-lock-open',
      submenu:[
        {titulo: 'Usuarios', url:'usuarios'},
        {titulo: 'Hospitales', url:'hospitales'},
        {titulo: 'Medicos', url:'medicos'},
      ]
    },//para agregar otro menu solo es copiar este arreglo


  ]*/

}
