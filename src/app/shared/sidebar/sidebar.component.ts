import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Tienda } from 'src/app/models/tienda.model';
import { TiendaService } from 'src/app/services/tienda.service';

@Component({
  selector: 'app-sidebar',
  standalone:false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {


  public usuario: Usuario;
  user:any;
  role:any;
  public menuActivo: string = '';
  tienda:Tienda;
  has_reservacion:boolean = false;
  has_cotizacion:boolean = false;
  usaDelivery:boolean = false;
  usaPedido:boolean = false;
  usaPromocion:boolean = false;
  
  private routeSubscription: Subscription;
  private tiendaSubscription: Subscription;

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    private router: Router,
    private tiendaService: TiendaService
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
    // 1. Carga inicial de la tienda (lo que ya tenías)
    this.getTienda();

    // 🚀 2. Escuchar activamente si la tienda se actualiza desde el modal
    this.tiendaSubscription = this.tiendaService.tiendaActualizada$.subscribe(() => {
      this.getTienda(); // Retorna y refresca las variables reactivas en tiempo real 
    });
  }

  getTienda(){
    this.tiendaService.getTiendaById(this.usuario.local).subscribe(
      (resp:any) => {
        this.tienda = resp;
        this.has_reservacion = resp.has_reservacion;
        this.has_cotizacion = resp.has_cotizacion;
        this.usaDelivery = resp.usaDelivery
        this.usaPedido = resp.usaPedido
        this.usaPromocion = resp.usaPromocion
      }
    )
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    // 🚀 Limpiamos la suscripción al destruir el componente
    if (this.tiendaSubscription) {
      this.tiendaSubscription.unsubscribe();
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

  toggleMenu(nombreMenu: string) {
  // Si vuelven a presionar la pestaña que ya está abierta, la cierra.
  // Si presionan una nueva, cierra la anterior y abre la actual.
  this.menuActivo = this.menuActivo === nombreMenu ? '' : nombreMenu;
}

}
