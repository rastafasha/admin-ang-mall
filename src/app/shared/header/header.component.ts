import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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

import * as io from "socket.io-client";
import { MessageService } from 'src/app/services/message.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  @Input() cartItem: CartItemModel;
  cartItems: any[] = [];
  total= 0;
  value: string;
  id:string;
  // categorias: Categoria[];
  public clienteSeleccionado: any ={};

  public carrito : Array<any> = [];
  public subtotal : any = 0;

  public identity;
  public cart;

  public usuario: Usuario;
  public congenerals: Congeneral[];
  public mensajes : Array<any> = [];
  public page:number;
  public pageSize = 15;
  public count_cat:number;

  public activeLang = 'es';
  flag = false;
  is_visible: boolean;
   langs: string[] = [];

  public socket = io(environment.soketServer);
public tienda_moneda : any;
  constructor(
    private usuarioService: UsuarioService,
    private congeralService: CongeneralService,
    private router: Router,
    private _contactoService :ContactoService,
    private _tiendaService :TiendaService,
    private translate: TranslateService,
    private storageService: StorageService,
    private _carritoService:CarritoService,
    private _messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService
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
      response=>{
        this.mensajes = response.data;
        this.count_cat = this.mensajes.length;
        this.page = 1;
      },
      error=>{

      }
    );

    this.congeralService.cargarCongenerals().subscribe(
      response=>{
        this.congenerals = response;
        console.log('header', this.congenerals);
      },
      error=>{

      }
    );

    if(this.storageService.existCart()){
      this.cartItems = this.storageService.getCart();
    }

    this.socket.on('new-carrito', function (data) {
      this.show_Carrito();
    }.bind(this));
    
    this.show_Carrito();
    
  }

  showCliente(){
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');

    // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
        this.clienteSeleccionado = JSON.parse(cliente);
    } else {
        this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }
  }

  public cambiarLenguaje(lang:any) {
    
    // this.activeLang = this.congenerals[0].lang;
    this.activeLang = lang;
    this.translate.use(this.activeLang);
    this.flag = !this.flag;
    this.is_visible = !this.is_visible;
    localStorage.setItem('lang', this.activeLang);
  }

  

  logout(){
    this.usuarioService.logout();
  }


  buscar(termino: string){

    if(termino.length === 0){
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);

  }

  getTienda(){
    this._tiendaService.getTiendaById(this.usuario.local).subscribe(
      tienda =>{
        this.tienda_moneda = tienda.moneda;
      }
    );

  }

  openMenu(){

    var menuLateral = document.getElementsByClassName("sidemenu");
      for (var i = 0; i<menuLateral.length; i++) {
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
  show_Carrito(){
    this.subtotal = 0;
    if(this.clienteSeleccionado){

      this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
        response =>{
          this.carrito = response.carrito;
          console.log('CARRITO header: ',this.carrito);
  
          this.carrito.forEach(element => {
            this.subtotal = this.subtotal + (element.precio*element.cantidad);
          });
  
          // refrescar cambios en la vista del carrito del header
          this.cdr.detectChanges();
        },
        error=>{
          console.log(error);
  
        }
      );
    }
  }

  // modificado por José Prados
  remove_producto(id){
    this._carritoService.remove_carrito(id).subscribe(
      response=>{
        this.subtotal = this.subtotal - (response.carrito.precio*response.carrito.cantidad);
        this._carritoService.preview_carrito(this.identity.uid).subscribe(
          response =>{
            this.carrito = response;
            this.socket.emit('save-carrito', {new:true});

            // refrescar cambios en la vista del carrito del header
            this.cdr.detectChanges();
          },
          error=>{
            console.log(error);

          }
        );
      },
      error=>{

      }
    );
  }

  onDarkMode(dark:string){
    var element = document.body;

    const classExists = document.getElementsByClassName(
      'darkmode'
     ).length > 0;

    var dayNight = document.getElementsByClassName("site");
      for (var i = 0; i<dayNight.length; i++) {
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


}
