import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { ContactoService } from 'src/app/services/contact.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { Congeneral } from 'src/app/models/congeneral.model';
import { CongeneralService } from 'src/app/services/congeneral.service';
import { CartItemModel } from 'src/app/models/cart-item-model';
import { StorageService } from 'src/app/services/storage.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { environment } from 'src/environments/environment';
import { io } from "socket.io-client";
import { BehaviorSubject, Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly VAPID_PUBLIC_KEY = environment.VAPI_KEY_PUBLIC;

  // El BehaviorSubject requiere un valor inicial obligatorio entre los paréntesis
  public isSubscribed$ = new BehaviorSubject<boolean>(false); // Arranca en falso (no suscrito)
  public isProcessing$ = new BehaviorSubject<boolean>(false); // Arranca en falso (no cargando)


  @Input() cartItem: CartItemModel;
  cartItems: any[] = [];
  total = 0;
  value: string;
  id: string;
  // categorias: Categoria[];
  public clienteSeleccionado: any = {};

  public carrito: Array<any> = [];
  public subtotal: any = 0;

  public identity;
  public cart;

  public usuario: Usuario;
  public congenerals: Congeneral[];
  public mensajes: Array<any> = [];
  public page: number;
  public pageSize = 15;
  public count_cat: number;

  public activeLang = 'es';
  private cartSubscription?: Subscription;
  flag = false;
  is_visible: boolean;
  langs: string[] = [];

  // Dropdown visibility flags
  showCartDropdown = false;
  public showMessagesDropdown: boolean = false;     // ✉️ Para los correos (SUPERADMIN)
  public showNotificationDropdown: boolean = false; // 🔔 Para la campana (ADMIN/SUPERADMIN)
  showLanguageDropdown = false;
  showProfileDropdown = false;
  public listaNotificaciones: any[] = [];
  totalNoLeidas: number = 0

  public socket = io(environment.soketServer);
  public tienda_moneda: any;
 

  constructor(
    private usuarioService: UsuarioService,
    private congeralService: CongeneralService,
    private router: Router,
    private _contactoService: ContactoService,
    private _tiendaService: TiendaService,
    private translate: TranslateService,
    private storageService: StorageService,
    private _carritoService: CarritoService,
    private _messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService,
    private notificacionService: NotificacionService,
    private pushNotificacionService: PushNotificationService,
    private swPush: SwPush,
    private toastr: ToastrService,
  ) {
    // this.usuario = usuarioService.usuario;

    this.translate.setDefaultLang(this.activeLang);
    this.translate.use('es');
    // this.translate.addLangs(["es", "en"]);
    // this.langs = this.translate.getLangs();
    // this.identity = usuarioService.usuario;
    localStorage.getItem('lang');
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.usuario = JSON.parse(user);
    this.showCliente();
    this.getTienda();
    this.flag = true;
    this._contactoService.listar().subscribe(
      response => {
        this.mensajes = response.data;
        this.count_cat = this.mensajes.length;
        this.page = 1;
      },
      error => {

      }
    );

    this.congeralService.cargarCongenerals().subscribe(
      response => {
        this.congenerals = response;
        // console.log('header', this.congenerals);
      },
      error => {

      }
    );

    if (this.storageService.existCart()) {
      this.cartItems = this.storageService.getCart();
    }

    this.socket.on('new-carrito', function (data) {
      this.show_Carrito();
    }.bind(this));

    this.cartSubscription = this._carritoService.cart$.subscribe(cart => {
      this.carrito = cart;
      this.subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
      this.cdr.detectChanges();
    });

    this.show_Carrito();
    this.inicializarNotificaciones();

  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Toggle methods for dropdowns
  toggleMessagesDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeAllDropdowns();
    this.showMessagesDropdown = !this.showMessagesDropdown;
  }


  toggleCartDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeAllDropdowns();
    this.showCartDropdown = !this.showCartDropdown;
  }

  toggleLanguageDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeAllDropdowns();
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  toggleProfileDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeAllDropdowns(): void {
    this.showMessagesDropdown = false;
    this.showCartDropdown = false;
    this.showLanguageDropdown = false;
    this.showProfileDropdown = false;
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeAllDropdowns();
    }
  }

  showCliente() {
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');

    // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
      this.clienteSeleccionado = JSON.parse(cliente);
    } else {
      this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }
  }

  public cambiarLenguaje(lang: any) {

    // this.activeLang = this.congenerals[0].lang;
    this.activeLang = lang;
    this.translate.use(this.activeLang);
    this.flag = !this.flag;
    this.is_visible = !this.is_visible;
    localStorage.setItem('lang', this.activeLang);
  }



  logout() {
    this.usuarioService.logout();
  }


  buscar(termino: string) {

    if (termino.length === 0) {
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);

  }

  getTienda() {
    this._tiendaService.getTiendaById(this.usuario.local).subscribe(
      tienda => {
        this.tienda_moneda = tienda.moneda;
      }
    );

  }

  openMenu() {

    var menuLateral = document.getElementsByClassName("sidemenu");
    for (var i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.toggle('active');

    }
  }

  /**
   * Alterna el estado del sidebar usando el servicio
   */
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
    this.updateSidebarClasses();
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


  // modificado por Jose Prados
  show_Carrito() {
    this.subtotal = 0;
    if (this.clienteSeleccionado) {

      this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
        response => {
          this.carrito = response.carrito;
          this.carrito.forEach(element => {
            this.subtotal = this.subtotal + (element.precio * element.cantidad);
          });

          // refrescar cambios en la vista del carrito del carrito del header
          this.cdr.detectChanges();
        },
        error => {
          console.log(error);

        }
      );
    }
  }

  // modificado por José Prados
  remove_producto(id) {
    this._carritoService.remove_carrito(id).subscribe(
      response => {
        this.subtotal = this.subtotal - (response.carrito.precio * response.carrito.cantidad);
        this._carritoService.preview_carrito(this.identity.uid).subscribe(
          response => {
            this.carrito = response;
            this.socket.emit('save-carrito', { new: true });

            // refrescar cambios en la vista del carrito del header
            this.cdr.detectChanges();
          },
          error => {
            console.log(error);

          }
        );
      },
      error => {

      }
    );
  }

  onDarkMode(dark: string) {
    var element = document.body;

    const classExists = document.getElementsByClassName(
      'darkmode'
    ).length > 0;

    var dayNight = document.getElementsByClassName("site");
    for (var i = 0; i < dayNight.length; i++) {
      // dayNight[i].classList.toggle("darkmode");
      element.classList.toggle("darkmode");

    }
    // localStorage.setItem('dark', dark);

    if (classExists) {
      localStorage.removeItem('darkmode');
      // console.log('✅ class exists on page, removido');
    } else {
      localStorage.setItem('darkmode', dark);
      // console.log('⛔️ class does NOT exist on page, agregado');
    }
    // console.log('Pulsado');
  }


  // notificaciones

  toggleNotificationDropdown(event: Event): void {
    event.preventDefault();

    // Guardamos cómo estaba antes de limpiar la pantalla
    const estadoActual = this.showNotificationDropdown;

    // Cerramos cualquier otro menú abierto
    this.closeAllDropdowns();

    // Asignamos el estado invertido
    this.showNotificationDropdown = !estadoActual;

    // Si se abrió, escuchamos un clic en cualquier parte de la pantalla para cerrarlo si pinchan fuera
    if (this.showNotificationDropdown) {
      const clickAfuera = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Si el clic NO fue dentro de un elemento con la clase .dropdown, cerramos
        if (!target.closest('.dropdown')) {
          this.showNotificationDropdown = false;
          document.removeEventListener('click', clickAfuera); // Limpiamos el escuchador
        }
      };
      // Pequeño retraso para que no se ejecute con el mismo clic de apertura
      setTimeout(() => document.addEventListener('click', clickAfuera), 0);
    }
  }



  eliminarUna(id: string, event: Event) {
    event.stopPropagation(); // Evita redirigir
    event.preventDefault();  // Evita recargas
    this.notificacionService.borrarNotificacion(id).subscribe(() => {
      this.cargarHistorialDropdown();
    });
  }


  // 🟢 FUNCIÓN PARA TRAER LAS NOTIFICACIONES AL DROPDOWN
  cargarHistorialDropdown() {
    // Solo consultamos al backend si el dropdown se está abriendo 
    // (es decir, si showMessageDropdown pasó a ser true tras el click)
    if (this.showNotificationDropdown) {

      // Llamamos al método que adaptamos en tu servicio (página 1 para el dropdown corto)
      this.notificacionService.obtenerHistorialCompleto(1).subscribe({
        next: (res) => {
          if (res.ok && res.notificaciones) {
            // Asignamos el arreglo real de la base de datos a tu variable blindada
            this.listaNotificaciones = res.notificaciones;

            console.log('Notificaciones cargadas con éxito:', this.listaNotificaciones);
          }
        },
        error: (err) => {
          console.error('Error al traer las notificaciones del backend:', err);
          this.listaNotificaciones = []; // Aseguramos arreglo vacío en caso de falla
        }
      });

    }
  }

  inicializarNotificaciones() {
    // 1. Verificamos si las notificaciones están disponibles en este navegador/dispositivo
    if (!this.swPush.isEnabled) {
      console.log('Las notificaciones Push no están soportadas o activadas en este dispositivo.');
      return;
    }

    // 2. Solicitamos la suscripción al navegador (esto dispara la ventana de "Permitir Notificaciones")
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      

      if (this.usuario.uid) {
        // Estructuramos el objeto idéntico a lo que espera tu backend
        const payloadSuscripcion = {
          user: this.usuario.uid,
          endpoint: sub.endpoint,
          keys: sub.toJSON().keys // Contiene auth y p256dh de forma nativa
        };

        // 4. Enviamos la suscripción a tu API de Node.js para que se guarde en la BD
        this.pushNotificacionService.guardarPushSubscription(sub).subscribe({
  next: () => {
    console.log('✅ ¡Suscripción guardada en el backend!');
    this.isSubscribed$.next(true);
    this.isProcessing$.next(false);
    this.toastr.success('¡Notificaciones activadas!'); 
  },
  error: err => {
    console.error('❌ Error al guardar en el servidor:', err);
    this.isProcessing$.next(false);
    this.toastr.error('Error', 'No se pudo registrar el dispositivo');
  }
});
      }
    })
    .catch(err => console.error('El usuario rechazó las notificaciones o hubo un fallo:', err));
  }


}
