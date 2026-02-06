import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';
import {environment} from 'src/environments/environment';
import { TiendaService } from 'src/app/services/tienda.service';
import { FacturaComponent } from '../factura/factura.component';
import Swal from 'sweetalert2';
import { ProductoService } from 'src/app/services/producto.service';
import { Usuario } from 'src/app/models/usuario.model';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-admin-ventas',
  templateUrl: './admin-ventas.component.html',
  styleUrls: ['./admin-ventas.component.css']
})
export class AdminVentasComponent implements OnInit {
  public mydate = new Date();
  public identity;
  public filtro;
  public dias = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  public mes = 0;
  public dia = 0;
  public orden = 'fecha+';
  public estado = 'Venta en proceso';
  public codigo = '';
  public year;
  public url;

  public ventas : Array<any> =[];
  public ventasFiltradas : Array<any> = [];
  public tipo;

  public track;
  public msm_error_track = false;
  public data_view = 1;

  option_selected:number = 1;

  public data_ids : any = [];
  public count_selects=false;
  usuarios:Usuario[]=[];
  drivers:Usuario[]=[];

  public page;
  public pageSize = 15;
  public count_cat;

  p: number = 1;
  count: number = 8;

  // agregado por José Prados
  listTiendas: any;
  user:any;

  // accedo al componente hijo FacturaComponent, agregado por José Prados
  @ViewChild(FacturaComponent) factura !: FacturaComponent;

  itemSelected:any;

  public selectedValue: number = new Date().getFullYear();
  public query_income_year: any = [];
   public ventasDataYear: any[] = [];

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private _ventaService : VentaService,
    private _productoService: ProductoService, // agregado por José Prados
    private tiendaService: TiendaService, // agregado por José Prados
  ) {
    this.identity = this._userService.usuario;
    this.url = environment.baseUrl;

  }

  
  ngOnInit(): void {
    window.scrollTo(0,0);

    // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');

    // Obtener locales
    this.cargar_Locales();
    

    this.method_data_view(1);
    this.year = this.mydate.getFullYear();
    this._ventaService.init_data_admin().subscribe(
      response => {

        if(this.user.role==='SUPERADMIN'){
          this.ventas = response.data;
          this.ventasFiltradas = response.data;
          // this.count_cat = this.ventas.length;
        }
        if(this.user.role==='ADMIN'){
          this.ventas = response.data;
          this.ventasFiltradas = response.data;
          // this.count_cat = this.ventas.length;
        }
        else{
          this.ventas = response.data;
          // this.ventasFiltradas = response.data;
          this.ventasFiltradas = this.ventas.filter(item => item.user?.local===this.user.local)
        }
        
        this.page = 1;
        console.log('VENTAS',this.ventasFiltradas);

      }
    );

  }

  method_data_view(val){
    if(val == 1){
      this.data_view = 1;
      $('#btn-uno').removeClass('btn-secondary');
      $('#btn-uno').addClass('btn-dark');

      $('#btn-dos').removeClass('btn-dark');
      $('#btn-dos').addClass('btn-secondary');
    }else if(val == 2){
      this.data_view = 2;

      $('#btn-dos').removeClass('btn-secondary');
      $('#btn-dos').addClass('btn-dark');

      $('#btn-uno').removeClass('btn-dark');
      $('#btn-uno').addClass('btn-secondary');
    }
  }


  filtro_listar(filtro){

  }

  pills(id){
    if(id == 'home1'){
      $('#home1').addClass('show active');
      $('#profile1').removeClass('show active');
      $('#messages1').removeClass('show active');
    }
    else if(id == 'profile1'){
      $('#home1').removeClass('show active');
      $('#profile1').addClass('show active');
      $('#messages1').removeClass('show active');
    }
    else if(id == 'messages1'){
      $('#home1').removeClass('show active');
      $('#profile1').removeClass('show active');
      $('#messages1').addClass('show active');
    }
  }

  init_data(){
    this.search(null,null);
  }



  search(tipe,orden){
    var sortby;

    if(orden == null){
      sortby = 'fecha+';
    }
    else{
      sortby = orden;
    }

    if(tipe == null && orden == null){

      this._ventaService.get_data_venta_admin(null,null,null).subscribe(
        response=>{
          this.ventas = response.data;
          this.orden = 'fecha+';
          this.ventas.forEach(element => {
              element.checked = false;
          });
          this.count_cat = this.ventas.length;
        this.page = 1;

        },
        error=>{

        }
      );
    }else{

      if(tipe == undefined){

        this._ventaService.get_data_venta_admin(null,sortby,null).subscribe(
          response=>{
            this.ventas = response.data;
            this.orden = 'fecha+';
            this.ventas.forEach(element => {
                element.checked = false;
            });
            this.count_cat = this.ventas.length;
        this.page = 1;
          },
          error=>{

          }
        );
      }
      if(tipe == 'fecha'){
        let search = this.year+'-'+this.dia+'-'+this.mes;
        this._ventaService.get_data_venta_admin(search,sortby,tipe).subscribe(
          response=>{
            this.tipo = 'fecha';
            this.ventas = response.data;
            this.ventas.forEach(element => {
                element.checked = false;
            });
            this.count_cat = this.ventas.length;
        this.page = 1;
          },
          error=>{

          }
        );
      }
      else if(tipe == 'estado'){
        this._ventaService.get_data_venta_admin(this.estado,sortby,tipe).subscribe(
          response=>{
            this.tipo = 'estado';
            this.ventas = response.data;
            this.ventas.forEach(element => {
                element.checked = false;
            });
            this.count_cat = this.ventas.length;
            this.page = 1;
          },
          error=>{

          }
        );
      }
      else if(tipe == 'codigo'){
        this._ventaService.get_data_venta_admin(this.codigo,sortby,tipe).subscribe(
          response=>{
            this.tipo = 'codigo';
            this.ventas = response.data;
            this.ventas.forEach(element => {
                element.checked = false;
            });
            this.count_cat = this.ventas.length;
        this.page = 1;
          },
          error=>{

          }
        );
      }
    }


  }

  setTrack(trackForm,id){
    if(trackForm.valid){
      let data = {
        tracking_number : trackForm.value.track
      }
      this._ventaService.set_track(id,data).subscribe(
        response =>{
          this.search(null,null);
          this.track = '';
          $('#trak-'+id).modal('hide');
          $('.modal-backdrop').removeClass('show');
        },error=>{

        }
      );
    }else{
      this.msm_error_track = true;
    }
  }

  close_alert(){
    this.msm_error_track = false;
  }


  imprimir_factura(item:any){
    this.itemSelected = item;
    // console.log('imprimiendo factura... ',id)
    this.abrirModalEnviandoFactura();
    this.reduceStockForSale(this.itemSelected._id);

    // llamar al metodo cargarFactura del componente hijo FacturaComponent
    setTimeout(() => {
      this.factura.cargarFactura(this.itemSelected._id);
    }, 200);

    // espero 2 segundos y envio factura al cliente
    setTimeout(() => {
      this.factura.enviarFacturaCliente();
    }, 2000);
  }

  private abrirModalEnviandoFactura(){
    // Abre el modal con el spinner
    Swal.fire({
      title: 'Enviando Factura...',
      text: 'Por favor, espera',
      allowOutsideClick: false,
      didOpen: () => {
      Swal.showLoading();
      }
    });
  }


  reduceStockForSale(saleId: string){
    this._ventaService.detalle(saleId).subscribe(
      (resp: any) => {
        const detalles = resp.detalle;
        detalles.forEach((detalle: any) => {
          if(detalle.producto && detalle.cantidad){
            this._productoService.reducir_stock(detalle.producto._id, detalle.cantidad).subscribe(
              () => {
                console.log(`Stock reduced for product ${detalle.producto._id} by ${detalle.cantidad}`);
              },
              (error) => {
                console.error(`Error reducing stock for product ${detalle.producto._id}:`, error);
              }
            );
          }
        });

        // After reducing stock, proceed with invoice generation
        setTimeout(() => {
          this.factura.cargarFactura(this.itemSelected._id);
        }, 200);

        setTimeout(() => {
          this.factura.enviarFacturaCliente();
        }, 2000);
      },
      (error) => {
        console.error('Error fetching sale details:', error);
        // Proceed with invoice generation even if stock reduction fails
        setTimeout(() => {
          this.factura.cargarFactura(this.itemSelected._id);
        }, 200);

        setTimeout(() => {
          this.factura.enviarFacturaCliente();
        }, 2000);
      }
    );
  }

  cerrarModal(evt:string){
    Swal.close();

    if(evt==='exito'){
      

      // realizar update de itemSelected
      this._ventaService.update_envio(this.itemSelected._id).subscribe(
        response => {
          if(response.venta){
            this.itemSelected.estado='Enviado';
            console.log(response.venta);
          }
          else{
            console.log(response.error);
          }
        }
      );
    }
  }

  select_id(){
    this.count_selects = false;
    this.ventas.forEach(element => {
      if(element.checked){
        this.count_selects = true;
      }
    });
  }

  update_envio(){
    this.ventas.forEach(element => {
      if(element.checked){
        this._ventaService.update_envio(element._id).subscribe(
          response =>{

          },
          error=>{
            console.log(error);

          }
        );
      }
    });
    this.search(null,null);
    this.count_selects = false;
  }

  optionSelected(value:number){
    this.option_selected = value;
  }

 
  // agregado por José Prados
  private cargar_Locales(){
    this.tiendaService.cargarTiendas().subscribe(
      (resp:any) =>{
        this.listTiendas = resp;

        // console.log('locales: ',this.listTiendas)
      }
    )
  }

  // agregado por José Prados
  onChangeTienda(event:any){
    console.log(event.target.value)
    if( event.target.value === 'todas' ){
      // se seleccionó la opción de todas las ventas
      this.ventasFiltradas = this.ventas;
      console.log(this.ventasFiltradas)
    }
    else{
      // se seleccionó las ventas por un local
      this.ventasFiltradas = this.ventas.filter(item => item.local?._id===event.target.value)
      console.log(this.ventasFiltradas)
      
      
    }

  }

   selectedYear() {
    console.log(this.selectedValue);
    this.getDashboardAdminYear();
  }
  selecedList: any = [
    { value: '2022' },
    { value: '2023' },
    { value: '2024' },
    { value: '2025' },
    { value: '2026' },
    { value: '2027' },
    { value: '2028' },
    { value: '2029' },
    { value: '2030' },
  ];

  getDashboardAdminYear() {
    this._ventaService.get_year(this.selectedValue).subscribe((resp: any) => {
      this.ventasFiltradas = resp.data;
      console.log(this.ventasFiltradas)

    })
  }

  

}
