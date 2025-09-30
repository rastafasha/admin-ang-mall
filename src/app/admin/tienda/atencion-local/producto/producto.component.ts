import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { Producto } from 'src/app/models/producto.model';
import { ColorService } from 'src/app/services/color.service';
import { GaleriaService } from 'src/app/services/galeria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { SelectorService } from 'src/app/services/selector.service';
import { environment } from 'src/environments/environment';

import * as io from "socket.io-client";
import { Favorite } from 'src/app/models/favorite.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MessageService } from 'src/app/services/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VentaService } from 'src/app/services/venta.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  producto: any = [];
  categories: Categoria[];

  public clienteSeleccionado: any ={};

  public socket = io(environment.soketServer);

  public slug: Producto;
  public selectores : any = [];
  public galeria : any = [];
  public colores : any = [];
  public url;
  public img_select;
  public first_img;
  public cantidad_to_cart = 1;
  public precio_to_cart;
  public color_to_cart = '#16537e';
  public selector_to_cart = ' ';
  public err_stock ='';
  public selector_error = false;
  public identity;

  public comentarios :any=[];

  /*COMENTARIOS DATA */
  public cinco_estrellas = 0;
  public cuatro_estrellas = 0;
  public tres_estrellas = 0;
  public dos_estrellas = 0;
  public una_estrella = 0;

  public cinco_porcent = 0;
  public cuatro_porcent = 0;
  public tres_porcent = 0;
  public dos_porcent = 0;
  public uno_porcent = 0;
  public raiting_porcent = 0;
  public total_puntos = 0;
  public max_puntos = 0;
  public raiting_puntos= 0;

  /*PAGINATE COMENTS */
  public page;
  public pageSize = 5;
  public count_cat;
  public sort_data_coment = 'raiting';

  /*FORM RESEÑA */
  public id_review_producto;
  public review_comentario='';
  public review_pros='';
  public review_cons='';
  public review_estrellas='';
  
  public msm_error_review='';
  public msm_error = false;
  public msm_success_fav = false;
  public msm_success = false;
  productoSeleccionado:Producto;
  favoriteItem: Favorite;

  public get_state_user_producto_coment = false;

  /*NEWST */

  public news_productos : any = {};

  public data_cupon;

  constructor(
    public productoService: ProductoService,
    public categoryService: CategoriaService,
    public usuarioService: UsuarioService,
    public activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public router: Router,
    private sanitizer: DomSanitizer,
    private _galeriaService : GaleriaService,
    private _colorService :ColorService,
    private _selectorService : SelectorService,
    private _ventaService: VentaService,
    private _carritoService: CarritoService,
    private _comentarioService: ComentarioService,
    // private favoritoService: FavoritoService,
    // private webSocketService: WebSocketService,
  ) {
    this.url = environment.baseUrl;
    this.identity = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.obtenerProducto(params['id']);
      this.init_data(params['id']);
      this.getGalleryProducto(params['id']);
      this.getColorProducto(params['id']);
      this.getSelectorProducto(params['id']);
    });
    this.obtenerCategorias();

    this.socket.on('new-stock', function (data) {
      this.init_data();

    }.bind(this));

    this.listar_newest();

    if(!this.identity){
      this.router.navigateByUrl('/login');
    }
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');

    // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
        this.clienteSeleccionado = JSON.parse(cliente);
    } else {
        this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }

  }

  click_img(img,id){

    $('.cz-thumblist-item.active').removeClass('active');
    $('#'+id).addClass('active');
    this.first_img = img;

  }

  get_color(color){
    this.color_to_cart = color.color;
  }

  sort_coments(){
    this._comentarioService.get_data(this.producto._id,this.sort_data_coment).subscribe(
      response =>{

        this.comentarios = response.comentarios;

        this.count_cat = this.comentarios.length;
        this.page = 1;

        this.comentarios.forEach(element => {
          this._comentarioService.get_likes(element._id).subscribe(
            response =>{
              element.likes = response.data.length;
            },
            error=>{

            }
          );

          this._comentarioService.get_dislikes(element._id).subscribe(
            response =>{
              element.dislikes = response.data.length;
            },
            error=>{

            }
          );
        });
        console.log(this.comentarios);

      },
      error=>{
        console.log(error);

      }
    );
  }

  data_comentarios(){
    this._comentarioService.get_data(this.producto._id,"raiting").subscribe(
      response =>{

        this.comentarios = response.comentarios;


        this.count_cat = this.comentarios.length;
        this.page = 1;

        this.comentarios.forEach(element => {
          this._comentarioService.get_likes(element._id).subscribe(
            response =>{
              element.likes = response.data.length;
            },
            error=>{

            }
          );

          this._comentarioService.get_dislikes(element._id).subscribe(
              response =>{
                element.dislikes = response.data.length;
              },
              error=>{

              }
            );
          });


        this.comentarios.forEach((element,index) => {
          if(element.estrellas == 5){
            this.cinco_estrellas = this.cinco_estrellas + 1;
          }
          else if(element.estrellas == 4){
            this.cuatro_estrellas = this.cuatro_estrellas + 1;
          }
          else if(element.estrellas == 3){
            this.tres_estrellas = this.tres_estrellas + 1;
          }
          else if(element.estrellas == 2){
            this.dos_estrellas = this.dos_estrellas + 1;
          }
          else if(element.estrellas == 3){
            this.una_estrella = this.una_estrella + 1;
          }
        });

        this.cinco_porcent = (this.cinco_estrellas*100)/this.comentarios.length;
        this.cuatro_porcent = (this.cuatro_estrellas*100)/this.comentarios.length;
        this.tres_porcent = (this.tres_estrellas*100)/this.comentarios.length;
        this.dos_porcent = (this.dos_estrellas*100)/this.comentarios.length;
        this.uno_porcent = (this.una_estrella*100)/this.comentarios.length;

        /******************************************************************* */

        let puntos_cinco = 0;
        let puntos_cuatro = 0;
        let puntos_tres = 0;
        let puntos_dos = 0;
        let punto_uno = 0;

        puntos_cinco = this.cinco_estrellas * 5;
        puntos_cuatro = this.cuatro_estrellas * 4;
        puntos_tres = this.tres_estrellas * 3;
        puntos_dos = this.dos_estrellas * 2;
        punto_uno = this.una_estrella * 1;

        this.total_puntos = puntos_cinco + puntos_cuatro + puntos_tres + puntos_dos + punto_uno;
        this.max_puntos = this.comentarios.length * 5;

        this.raiting_porcent =(this.total_puntos*100)/this.max_puntos;

        this.raiting_puntos =(this.raiting_porcent*5)/100;

        if(isNaN(this.raiting_puntos)){
          this.raiting_puntos = 0;
        }
        if(isNaN(this.raiting_porcent)){
          this.raiting_porcent = 0;
        }

      },
      error=>{
        console.log(error);

      }
    );
  }

  listar_newest(){
    this.productoService.listar_newest().subscribe(
      response =>{
        this.news_productos = response.data;
      },
      error=>{

      }
    );
  }

  // ****************************

  init_data(_id:string){
    this.productoService.getProductoById(_id).subscribe(
      response =>{
        this.producto = response;
        

        if(this.clienteSeleccionado){
          this._ventaService.evaluar_venta_user(this.clienteSeleccionado.uid,this.producto._id).subscribe(
            response =>{
              this.get_state_user_producto_coment = response.data;
            },
            error=>{

            }
          );
        }

        this.data_comentarios();

        $('#detalle').html(this.producto.detalle);
        // $('#video_iframe').append(this.producto.video_review);
        // $('iframe').removeAttr('height');
        // $('iframe').attr('height','400px');


        this.precio_to_cart = this.producto.precio_ahora;


      },
      error=>{

      }
    );
  }

  getGalleryProducto(_id:string){
    this._galeriaService.find_by_product(_id).subscribe(
      response =>{
        response.galeria.forEach((element,index) => {
          if(index == 0){
            this.first_img = element.imagen;
          }
            this.galeria.push({_id:element._id,imagen : element.imagen});
        });
      },
      error=>{
        console.log(error);

      }
    );
  }

  getColorProducto(_id:string){
    this._colorService.colorByProduct(_id).subscribe(
      response =>{
        this.colores = response;
        this.color_to_cart = this.colores[0].color;
        console.log('colores: ',response);

      },
      error=>{

      }
    );
  }

  getSelectorProducto(_id:string){
    this._selectorService.selectorByProduct(_id).subscribe(
      response =>{
        this.selectores = response;

      },
      error=>{

      }
    );
  }

  obtenerProducto(_id:string){
    this.productoService.getProductoById(_id).subscribe(
      resp=>{
        this.producto = resp;
        console.log(this.producto);
      }
    )
  }

  obtenerCategorias(){
    return this.categoryService.cargarCategorias().subscribe(
      resp=>{
        this.categories = resp;
      }
    )
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
  }

  add_to_cart(carritoForm){
    if(this.cantidad_to_cart > this.producto.stock){
      this.err_stock = 'La cantidad no debe superar al stock';
    }
    else if(this.cantidad_to_cart <= 0){
      this.err_stock = 'La cantidad no puede ser un valor negativo';
    }
    else{
      this.err_stock = '';
      let data = {
        user: this.clienteSeleccionado.uid,
        producto : this.producto._id,
        cantidad : this.cantidad_to_cart,
        color : this.color_to_cart,
        selector : this.selector_to_cart,
        precio : this.precio_to_cart,
      }
      if(this.selector_to_cart != " "){
        this.selector_error = false;
        this._carritoService.registro(data).subscribe(
          response =>{
            this.socket.emit('save-carrito', {new:true});
            // $('#dark-toast').removeClass('hide');
            // $('#dark-toast').addClass('show');
            // setTimeout(function() {
            //     $("#dark-toast").fadeOut(1500);
            // },3000);
            this.msm_success = true;
            setTimeout(()=>{
              this.close_alert();
            },2500);
            
          },
          error=>{
  
          }
        );
      }else{
        this.selector_error = true;
      }
    }
  
  }

  add_likes(idcoment){

    let data = {
      comentario : idcoment,
      user : this.identity.uid
    }
  
    this._comentarioService.add_likes(data).subscribe(
      response =>{
        this.comentarios.forEach(element => {
          this._comentarioService.get_likes(element._id).subscribe(
            response =>{
              element.likes = response.data.length;
            },
            error=>{
  
            }
          );
        });
  
      },
      error=>{
        console.log(error);
  
      }
    );
  }
  
  add_dislikes(idcoment){
  
    let data = {
      comentario : idcoment,
      user : this.identity.uid
    }
  
    this._comentarioService.add_dislikes(data).subscribe(
      response =>{
        this.comentarios.forEach(element => {
          this._comentarioService.get_dislikes(element._id).subscribe(
            response =>{
              element.dislikes = response.data.length;
            },
            error=>{
  
            }
          );
        });
  
      },
      error=>{
        console.log(error);
  
      }
    );
  }
  
  saveComent(reviewForm){
    if(reviewForm.valid){
  
      let data = {
        comentario: reviewForm.value.review_comentario,
        pros: reviewForm.value.review_pros,
        cons: reviewForm.value.review_cons,
        estrellas: reviewForm.value.review_estrellas,
        user: this.clienteSeleccionado.uid,
        producto: this.producto._id,
      }
      this._comentarioService.registro(data).subscribe(
        response =>{
          this.msm_error_review = '';
          this.id_review_producto='';
          this.review_comentario='';
          this.review_pros='';
          this.review_cons='';
          this.review_estrellas='';
        },
        error=>{
          this.msm_error_review = error.error.message;
          this.id_review_producto='';
          this.review_comentario='';
          this.review_pros='';
          this.review_cons='';
          this.review_estrellas='';
        }
      );
  
    }else{
      this.msm_error_review = 'Complete correctamente los campos.';
    }
  }

  close_toast(){
    $('#dark-toast').removeClass('show');
        $('#dark-toast').addClass('hide');
  }
  
  /*
  addToFavorites(producto:any){
    // this.favoritoService.registro(this.productoSeleccionado);
    // console.log(this.producto);
  this.productoSeleccionado = producto;
    const data = {
      producto: this.productoSeleccionado._id,
      usuario: this.identity.uid,
    }
    
    this.favoritoService.registro(data ).subscribe((res:any)=>{
      this.favoriteItem = res;
      // console.log(this.favoriteItem);
      console.log('sending...', this.productoSeleccionado.titulo)
      // this.notificacion();
      this.msm_success_fav = true;
        setTimeout(()=>{
          this.close_alert()
        },2500);
      
    });
  }
  */
  
  close_alert(){
    this.msm_error = false;
    this.msm_error_review = '';
    this.msm_success_fav = false;
    this.msm_success = false;
    
  }

}
