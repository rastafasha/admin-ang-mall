import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {


  public usuario: Usuario;
  user:any;
  role:any;
  private routeSubscription: Subscription;

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {

    // this.usuario = usuarioService.usuario;

  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.usuario = JSON.parse(user);
    this.role = this.usuario.role;

    // Suscribirse a los cambios de ruta para cerrar el sidebar automáticamente
    this.routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Cerrar el sidebar al cambiar de página
        this.sidebarService.closeSidebar();
        
        // Aplicar las clases correspondientes al sidebar
        this.updateSidebarClasses();
      });

    // Aplicar estado inicial del sidebar
    this.updateSidebarClasses();
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  /**
   * Actualiza las clases CSS del sidebar según su estado
   */
  private updateSidebarClasses(): void {
    const wrapper = document.getElementById('main-wrapper');
    if (wrapper) {
      const isOpen = this.sidebarService.isSidebarOpen();
      
      if (isOpen) {
        wrapper.classList.add('show-sidebar');
      } else {
        wrapper.classList.remove('show-sidebar');
      }
    }
  }

  logout(){
    this.usuarioService.logout();
  }

}
