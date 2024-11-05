import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { CarritoService } from "src/app/services/carrito.service";
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import {environment} from 'src/environments/environment';

import { CuponService } from "src/app/services/cupons.service";
import { PostalService } from "src/app/services/postal.service";
import { DireccionService } from "src/app/services/direccion.service";
import { VentaService } from "src/app/services/venta.service";

declare var paypal;


declare var jQuery:any;
declare var $:any;

// import { WebSocketService } from 'src/app/services/web-socket.service';
import * as io from "socket.io-client";
// import { Direccion } from '../../models/direccion.model';
import { ProductoService } from 'src/app/services/producto.service';
import { MessageService } from 'src/app/services/message.service';
import { PaymentMethod } from 'src/app/models/paymenthmethod.model';
import { TiposdepagoService } from 'src/app/services/tiposdepago.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { PagoEfectivoService } from 'src/app/services/pago-efectivo.service';
import { Usuario } from 'src/app/models/usuario.model';
import { TiendaService } from 'src/app/services/tienda.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypal',{static:true}) paypalElement? : ElementRef;

  public clienteSeleccionado: any;

  public direcciones:any =[];
  public identity;
  public localId;
  public carrito : Array<any> = [];
  public subtotal : any = 0;
  public url;
  public cupon;
  public msm_error_cupon=false;
  public msm_success_cupon=false;
  public new_data_descuento;
  public data_keyup = 0;
  public data_save_carrito;
  public msm_error = '';
  public productos : any = {};
  public cursos : any = {};

  public paypal;

  public postales;

  public precio_envio;

  public socket = io(environment.soketServer);

  public no_direccion = 'no necesita direccion';



  //DATA
  public radio_postal;
  public medio_postal : any = {};
  public data_cupon;
  public id_direccion = '';
  public direccion : any;
  public data_direccion : any = {};
  public data_detalle : Array<any> = [];
  public data_venta : any = {};
  public info_cupon_string = '';
  public error_stock = false;
  public date_string;
  
  public data_direccionLocal : any = {};

  selectedMethod: string = '';

  habilitacionFormTransferencia:boolean = false;
  habilitacionFormEfectivo:boolean = false;

  paymentMethods:PaymentMethod[] = []; //array metodos de pago para transferencia (dolares, bolivares, movil)
  paymentSelected!:PaymentMethod; //metodo de pago seleccionado por el usuario (transferencia o efectivo)

  formTransferencia = new FormGroup({
    metodo_pago: new FormControl('',Validators.required),
    bankName: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    referencia: new FormControl('',Validators.required),
    name_person: new FormControl('', Validators.required),
    phone: new FormControl('',Validators.required),
    paymentday: new FormControl('', Validators.required)
  });

  formEfectivo = new FormGroup({
    amount: new FormControl('', Validators.required),
    name_person: new FormControl('', Validators.required),
    phone: new FormControl('',Validators.required),
    paymentday: new FormControl('', Validators.required)
  });
  
  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private _productoService : ProductoService,
    private _carritoService:CarritoService,
    private _cuponService :CuponService,
    private _postalService :PostalService,
    private _direccionService :DireccionService,
    private _tiendaService :TiendaService,
    private _ventaService :VentaService,
    private _messageService: MessageService,
    private _tipoPagos: TiposdepagoService,
    private _trasferencias: TransferenciaService,
    // private webSocketService: WebSocketService,
    private _pagoEfectivo: PagoEfectivoService,
    private cdr: ChangeDetectorRef
  ) {
    this.identity = _userService.usuario;
    this.localId = _userService.usuario.local;
    console.log('identidad usuario: ',this.identity);
    console.log('idLocal: ',this.localId);
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');

    // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
        this.clienteSeleccionado = JSON.parse(cliente);
    } else {
        this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }

    console.log('identidad cliente: ',this.clienteSeleccionado);

    this.url = environment.baseUrl;

  }

  ngOnInit(): void {

    this.direccionTienda();
    this.listAndIdentify();
    
  }
  
  private listAndIdentify(){
    this.listar_direcciones();
    this.listar_postal();
    this.listar_carrito();
    this.obtenerMetodosdePago();
    
    if(this.clienteSeleccionado){
      this.socket.on('new-carrito', function (data) {
        this.listar_carrito();

      }.bind(this));

      $('#card-pay').hide();
      $('#btn-back-data').hide();
      $('#card-data-envio').hide();
      

        paypal.Buttons({

          createOrder: (data,actions)=>{
            //VALIR STOCK DE PRODUCTOS
            this.data_venta.detalles.forEach(element => {
                if(element.producto.stock == 0){
                  this.error_stock = true;
                }else{
                  this.error_stock = false;
                }

            });

            if(!this.error_stock){
              return actions.order.create({
                purchase_units : [{
                  description : 'Compra en Linea',
                  amount : {
                    currency_code : 'USD',
                    value: Math.round(this.subtotal),
                  }

                }]
              });
            }else{
              this.error_stock = true;
              this.listar_carrito();
            }
          },
          onApprove : async (data,actions)=>{
            const order = await actions.order.capture();
            console.log(order);
            this.data_venta.idtransaccion = order.purchase_units[0].payments.captures[0].id;
            this._ventaService.registro(this.data_venta).subscribe(
              response =>{
                this.data_venta.detalles.forEach(element => {
                  console.log(element);
                  this._productoService.aumentar_ventas(element.producto._id).subscribe(
                    response =>{
                    },
                    error=>{
                      console.log(error);

                    }
                  );
                    this._productoService.reducir_stock(element.producto._id,element.cantidad).subscribe(
                      response =>{
                        this.remove_carrito();
                        this.listar_carrito();
                        this.socket.emit('save-carrito', {new:true});
                        this.socket.emit('save-stock', {new:true});
                        this._router.navigate(['/app/cuenta/ordenes']);
                      },
                      error=>{
                        console.log(error);

                      }
                    );
                });

              },
              error=>{
                console.log(error);

              }
            );
          },
          onError : err =>{
            console.log(err);

          }
        }).render(this.paypalElement.nativeElement);
      //
      this.url = environment.baseUrl;

      this.carrito_real_time();

    }
    else{
      this._router.navigate(['/']);
    }
  }

  // metodo llamado desde el formulario (submit) para registrar una transferencia
  sendFormTransfer(){
    if(this.formTransferencia.valid){
      // llamo al servicio
      this._trasferencias.createTransfer(this.formTransferencia.value).subscribe(resultado => {
        console.log('resultado: ',resultado);
        this.verify_dataComplete();
        if(resultado.ok){
          // transferencia registrada con exito
          console.log(resultado.payment);
          alert('Transferencia registrada con exito');

          // eliminar carrito luego de haber realzado la compra con transferencia exitosa
          this.remove_carrito();
        }
        else{
          // error al registar la transferencia
          alert('Error al registrar la transferencia');
          console.log(resultado.msg);
        }
      });
    }
  }

  sendFormEffective(){
    if(this.formEfectivo.valid){
      console.log(this.formEfectivo.value)

      this._pagoEfectivo.registro(this.formEfectivo.value).subscribe(
        resultado => {
          console.log('resultado: ',resultado);

          if(resultado.ok){
            // console.log(resultado.pago_efectivo);
            this.verify_dataComplete();
            alert('Pago en efectivo registrado con éxito');

            // eliminar carrito luego de haber realzado la compra con transferencia exitosa
            this.remove_carrito();
          }
          else{
            alert('Error al registrar el pago en efectivo');
            console.log(resultado.msg);
          }
          
        }
      );
    }
  }

  // metodo para el cambio del select 'tipo de transferencia'
  onChangePayment(event:Event){
    const target = event.target as HTMLSelectElement; //obtengo el valor
    console.log(target.value)

    // guardo el metodo seleccionado en la variable de clase paymentSelected
    this.paymentSelected = this.paymentMethods.filter(method => method._id===target.value)[0]
  }

  // agregado por José Prados
  private obtenerMetodosdePago(){
    this._tipoPagos.getPaymentMethods().subscribe(data => {
      // console.log('metodos de pago: ',data.paymentMethods)
      this.paymentMethods = data;
      console.log('metodos de pago: ',this.paymentMethods)
    });
  }

  // Método que se llama cuando cambia el select
  onPaymentMethodChange(event: any) {
    this.selectedMethod = event.target.value;
    // console.log('metodo de pago seleccionado: ',this.selectedMethod)

    if(this.selectedMethod==='transferencia'){
      // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
      this.habilitacionFormTransferencia = true;
      this.habilitacionFormEfectivo = false;
    }
    else if(this.selectedMethod==='efectivo'){
      // efectivo
      this.habilitacionFormEfectivo = true;
      this.habilitacionFormTransferencia = false;
    }
  }

  // modificado por Jose Prados
  remove_carrito(){
    this.carrito.forEach((element,index) => {
        this._carritoService.remove_carrito(element._id).subscribe(
          response =>{
            this.listar_carrito();
          },
          error=>{
            console.log(error);
          }
        );
    });

    // esto se agregó para guardar y actualizar el carrito luego de eliminar todo
    this.socket.emit('save-carrito', {new:true});
    this.listar_carrito();
  }

  carrito_real_time(){
    this.socket.on('new-carrito', function (data) {
      this.subtotal = 0;

      this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
        response =>{
          this.carrito = response;

          this.carrito.forEach(element => {
            this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
          });

        },
        error=>{
          console.log(error);

        }
      );

    }.bind(this));
  }

  listar_postal(){
    this._postalService.listar().subscribe(
      response =>{
        this.postales = response.postales
        this.postales.forEach((element,index) => {
          if(index == 0){
            this.radio_postal = element._id;
            this.medio_postal = {
              tipo_envio : element.titulo,
              precio: element.precio,
              tiempo: element.tiempo,
              dias : element.dias
            };
            this.precio_envio = element.precio;
          }
        });

      },
      error=>{

      }
    );
  }

  // modificado por José Prados
  listar_direcciones(){
    this._direccionService.listarUsuario(this.clienteSeleccionado.uid).subscribe(
      response =>{
        // modificado: response por response.direcciones
        this.direcciones = response.direcciones;
        console.log('Direcciones: ',this.direcciones);
      },
      error=>{

      }
    );
  }

  // get_direccion(id_direccion:any){
  //   this.data_direccion = id_direccion;
  //   this._direccionService.get_direccion(this.data_direccion).subscribe(
  //     response =>{
  //       this.data_direccion = response;
  //       console.log(this.data_direccion);
  //     }
  //   );

  // }
 
  direccionTienda(){
    this._tiendaService.getTiendaById(this.localId).subscribe(
      tienda =>{
        this.data_direccionLocal = tienda;
        console.log('direccion del local', this.data_direccionLocal);
      }
    );

  }


  listar_carrito(){
    this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
      response =>{
        this.carrito = response.carrito;
        console.log('CARRITO: ',this.carrito)
        this.subtotal = 0;
        this.carrito.forEach(element => {
          this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
          this.data_detalle.push({
            producto : element.producto,
            cantidad: element.cantidad,
            precio: Math.round(element.precio),
            color: element.color,
            selector : element.selector
          });
        });
        this.subtotal = Math.round(this.subtotal + parseInt(this.precio_envio));
        // refrescar cambios en la vista del carrito del header
        this.cdr.detectChanges();

      },
      error=>{
        console.log(error);

      }
    );
  }



  remove_producto(id){
    console.log('eliminar prod: ',id)
    this._carritoService.remove_carrito(id).subscribe(
      response=>{
        this.subtotal = Math.round(this.subtotal - (response.carrito.precio*response.carrito.cantidad));
        this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
          response =>{
            this.carrito = response;
            this.socket.emit('save-carrito', {new:true});
            this.listar_carrito();
          },
          error=>{
            console.log(error);

          }
        );
        this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
          response =>{
            this.carrito = response.carrito;
            this.data_detalle = [];
            this.carrito.forEach(element => {
              this.data_detalle.push({
                producto : element.producto,
                cantidad: element.cantidad,
                precio: element.precio,
                color: element.color,
                selector : element.selector
              })
            });
            console.log(this.data_detalle);


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

  

  // get_data_cupon(event,cupon){
  //   this.data_keyup = this.data_keyup + 1;

  //   if(cupon){
  //     if(cupon.length == 13){
  //       console.log('siii');

  //       this._cuponService.get_cuponCode(cupon).subscribe(
  //         response =>{
  //           this.data_cupon = response[0];
  //           console.log(this.data_cupon);

  //           this.msm_error_cupon = false;
  //           this.msm_success_cupon = true;

  //           this.carrito.forEach((element,indice) => {
  //               if(response.tipo == 'subcategoria'){
  //                 if(response.subcategoria == element.producto.subcategoria){

  //                   if(this.data_keyup == 0 || this.data_keyup == 1){

  //                     let new_subtotal = element.precio - ((element.precio*response.descuento)/100);
  //                     console.log(new_subtotal);
  //                     element.precio = new_subtotal;

  //                     this.subtotal = 0;
  //                     this.carrito.forEach(element => {
  //                       this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
  //                     });

  //                   }
  //                 }
  //               }
  //               if(response.tipo == 'categoria'){
  //                 if(response.categoria == element.producto.categoria){

  //                   if(this.data_keyup == 0 || this.data_keyup == 1){

  //                     let new_subtotal = element.precio - ((element.precio*response.descuento)/100);
  //                     console.log(new_subtotal);
  //                     element.precio = new_subtotal;

  //                     this.subtotal = 0;
  //                     this.carrito.forEach(element => {
  //                       this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
  //                     });

  //                   }

  //                 }
  //               }
  //           });

  //         },
  //         error=>{
  //           this.data_keyup = 0;
  //           this.msm_error_cupon = true;

  //           this.msm_success_cupon = false;
  //           this.listar_carrito();
  //           this.listar_postal();
  //         }
  //       );
  //     }else{
  //       console.log('nooo');

  //       this.data_keyup = 0;
  //       this.msm_error_cupon = false;
  //       this.msm_success_cupon = false;
  //       this.listar_carrito();

  //     }
  //   }else{
  //     this.data_keyup = 0;
  //       this.msm_error_cupon = false;
  //       this.msm_success_cupon = false;
  //       this.listar_carrito();

  //   }

  // }

  select_postal(event,data){
    //RESTAR PRECIO POSTAL ANTERIOR
    this.subtotal = Math.round(this.subtotal - parseInt(this.medio_postal.precio));

    this.medio_postal = {
      tipo_envio : data.titulo,
      precio: data.precio,
      tiempo: data.tiempo,
      dias: data.dias,
    }
    this.subtotal = Math.round(this.subtotal + parseInt(this.medio_postal.precio));

  }

  verify_data(){
    if(this.localId){
      this.msm_error = '';
      $('#btn-verify-data').animate().hide();
      $('#btn-back-data').animate().show();

      $('#card-data-envio').animate().show();

      $('#card-pay').animate().show('fast');
      $('.cart-data-venta').animate().hide('fast');



      if(this.data_cupon){
        if(this.data_cupon.categoria){
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.categoria.nombre;
        }else if(this.data_cupon.subcategoria){
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.subcategoria;
        }
      }

      var fecha = new Date();

      var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];
      fecha.setDate(fecha.getDate() + parseInt(this.medio_postal.dias));
      this.date_string =  fecha.getDate() +' de ' + months[fecha.getMonth()] + ' del ' + fecha.getFullYear();


      this.data_venta = {
        user : this.clienteSeleccionado.uid,
        total_pagado : this.subtotal,
        codigo_cupon : this.cupon,
        info_cupon :  this.info_cupon_string,
        idtransaccion : null,
        metodo_pago : 'Paypal',

        tipo_envio: this.medio_postal.tipo_envio,
        precio_envio: this.medio_postal.precio,
        tiempo_estimado: this.date_string,

        direccion: this.data_direccionLocal.direccion,
        destinatario: this.clienteSeleccionado.first_name +''+ this.clienteSeleccionado.last_name,
        detalles:this.data_detalle,
        referencia: this.data_direccionLocal.referencia,
        pais: this.data_direccionLocal.pais,
        ciudad: this.data_direccionLocal.ciudad,
        zip: this.data_direccionLocal.zip,
      }

      console.log(this.data_venta);


    }else{
      this.msm_error = "Seleccione una dirección de envio.";
    }

  }

  back_data(){
    $('#btn-verify-data').animate().show();
    $('#btn-back-data').animate().hide();

    $('#card-data-envio').animate().hide();

    $('#card-pay').animate().hide('fast');
      $('.cart-data-venta').animate().show('fast');
  }

  verify_dataComplete(){
    if(this.localId){
      this.msm_error = '';
      $('#btn-verify-data').animate().hide();
      $('#btn-back-data').animate().show();

      $('#card-data-envio').animate().show();

      $('#card-pay').animate().show('fast');
      $('.cart-data-venta').animate().hide('fast');



      if(this.data_cupon){
        if(this.data_cupon.categoria){
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.categoria.nombre;
        }else if(this.data_cupon.subcategoria){
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.subcategoria;
        }
      }

      var fecha = new Date();

      var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];
      fecha.setDate(fecha.getDate() + parseInt(this.medio_postal.dias));
      this.date_string =  fecha.getDate() +' de ' + months[fecha.getMonth()] + ' del ' + fecha.getFullYear();


      this.data_venta = {
        user : this.clienteSeleccionado.uid,
        total_pagado : this.subtotal,
        codigo_cupon : this.cupon,
        info_cupon :  this.info_cupon_string,
        idtransaccion : null,
        metodo_pago : this.selectedMethod,
        // metodo_pago : 'Paypal',

        tipo_envio: this.medio_postal.tipo_envio,
        precio_envio: this.medio_postal.precio,
        tiempo_estimado: this.date_string,

        direccion: this.data_direccionLocal.direccion,
        destinatario: this.clienteSeleccionado.first_name +''+ this.clienteSeleccionado.last_name,
        detalles:this.data_detalle,
        referencia: this.data_direccionLocal.referencia,
        pais: this.data_direccionLocal.pais,
        ciudad: this.data_direccionLocal.ciudad,
        zip: this.data_direccionLocal.zip,
      }

      console.log(this.data_venta);

      this.saveVenta();

    }else{
      this.msm_error = "Seleccione una dirección de envio.";
    }

  }

  saveVenta(){
    this._ventaService.registro(this.data_venta).subscribe(response =>{
      this.data_venta.detalles.forEach(element => {
        console.log(element);
        this._productoService.aumentar_ventas(element.producto._id).subscribe(
          response =>{
          },
          error=>{
            console.log(error);

          }
        );
          this._productoService.reducir_stock(element.producto._id,element.cantidad).subscribe(
            response =>{
              this.remove_carrito();
              this.listar_carrito();
              this.socket.emit('save-carrito', {new:true});
              this.socket.emit('save-stock', {new:true});
              this._router.navigate(['/dashboard/ventas/modulo']);
            },
            error=>{
              console.log(error);

            }
          );
      });

    },)
  }
}
