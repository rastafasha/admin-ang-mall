import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];
  
  // Estado del sidebar - por defecto cerrado
  private sidebarOpen = new BehaviorSubject<boolean>(false);
  public sidebarOpen$ = this.sidebarOpen.asObservable();

  constructor() {
    // Verificar si hay preferencia guardada en localStorage
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      this.sidebarOpen.next(JSON.parse(savedState));
    }
  }

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];
  }

  // Alternar el estado del sidebar
  toggleSidebar() {
    const newState = !this.sidebarOpen.value;
    this.sidebarOpen.next(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  }

  // Abrir el sidebar
  openSidebar() {
    this.sidebarOpen.next(true);
    localStorage.setItem('sidebarOpen', 'true');
  }

  // Cerrar el sidebar
  closeSidebar() {
    this.sidebarOpen.next(false);
    localStorage.setItem('sidebarOpen', 'false');
  }

  // Obtener el estado actual
  isSidebarOpen(): boolean {
    return this.sidebarOpen.value;
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
