import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { ContactoService } from 'src/app/services/contact.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { Congeneral } from 'src/app/models/congeneral.model';
import { CongeneralService } from 'src/app/services/congeneral.service';
import { CartItemModel } from 'src/app/models/cart-item-model';
import { StorageService } from 'src/app/services/storage.service';
import { CarritoService } from 'src/app/services/carrito.service';

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

  constructor(
    private usuarioService: UsuarioService,
    private congeralService: CongeneralService,
    private router: Router,
    private _contactoService :ContactoService,
    private translate: TranslateService,
    private storageService: StorageService,
    private _carritoService:CarritoService,
  ) {
    this.usuario = usuarioService.usuario;
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {
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
        // console.log('header', this.congenerals);
      },
      error=>{

      }
    );

    if(this.storageService.existCart()){
      this.cartItems = this.storageService.getCart();
    } 
    
    this.show_Carrito();
  }

  public cambiarLenguaje(lang:any) {
    this.activeLang = lang;
    this.translate.use(lang);
    this.flag = !this.flag;
    this.is_visible = !this.is_visible;
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

  openMenu(){

    var menuLateral = document.getElementsByClassName("sidemenu");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.toggle('active');

      }
  }


  show_Carrito(){
    this._carritoService.preview_carrito(this.identity.uid).subscribe(
      response =>{
        this.carrito = response;

        this.carrito.forEach(element => {
          this.subtotal = this.subtotal + (element.precio*element.cantidad);
        });
        console.log(this.carrito);

      },
      error=>{
        console.log(error);

      }
    );
  }
  remove_producto(id){
    this._carritoService.remove_carrito(id).subscribe(
      response=>{
        this.subtotal = this.subtotal - (response.carrito.precio*response.carrito.cantidad);
        this._carritoService.preview_carrito(this.identity.uid).subscribe(
          response =>{
            this.carrito = response;
            // this.socket.emit('save-carrito_dos', {new:true});


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


}
