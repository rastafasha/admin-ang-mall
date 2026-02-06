import { Component, Input, OnInit, Output } from '@angular/core';
import { VentaService } from 'src/app/services/venta.service';
import { UsuarioService } from '../../services/usuario.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/models/usuario.model';
import { Producto } from 'src/app/models/producto.model';
declare let Chart;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public bestsellers: Producto[] = [];
  public populares: Producto[] = [];

  public total_mes = 0;
  public total_ventas = 0;
  public current_month;
  public last_month;
  public dinero_ganado = 0;
  public total_ventas_ant = 0;
  public total_ganado_ant = 0;
  public mes_anterior;
  public mes_actual;
  public num_user = 0;
  public current_year;
  public url;
  public last_sellers: Array<any> = [];
  public num_productos = 0;
  public num_ventas = 0;
  public num_comentarios = 0;

  public totalUsuarios: number = 0;
  public totalEmployees: number = 0;
  public totalClients: number = 0;
  public totalLocals: number = 0;
  public totalLocalsEmployees: number = 0;

  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public employees: Usuario[] = [];
  public employeesTemp: Usuario[] = [];

  public desde: number = 0;

  public selectedValue: number = new Date().getFullYear();
  public query_income_year: any = [];

  public total_ganado = {
    enero: 0,
    febrero: 0,
    marzo: 0,
    abril: 0,
    mayo: 0,
    junio: 0,
    julio: 0,
    agosto: 0,
    septiembre: 0,
    octubre: 0,
    noviembre: 0,
    diciembre: 0,
  }

  public total_ganado_last = {
    enero: 0,
    febrero: 0,
    marzo: 0,
    abril: 0,
    mayo: 0,
    junio: 0,
    julio: 0,
    agosto: 0,
    septiembre: 0,
    octubre: 0,
    noviembre: 0,
    diciembre: 0,
  }
  public ventasData: any[] = [];
  public ventasDataYear: any[] = [];
  public identity;
  public usuario;


  constructor(
    private _ventaService: VentaService,
    private _userService: UsuarioService,
    private _productoService: ProductoService,
    private _comentarioService: ComentarioService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    this.url = environment.baseUrl;
    this.identity = this._userService.usuario;

  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.usuario = JSON.parse(user);

    if (this.usuario.role === 'ALMACEN') {
      this._router.navigate(['./dashboard/producto'])
    }
    if (this.usuario.role === 'TIENDA') {
      this._router.navigate(['/dashboard/atencion-local'])
    }

    this.data_Dashboard();
    this.data_ventas();
    this.getDashboardAdminYear();

    this.getProducts();
    this.getProductsBstSll();
    this.getProductsPop();
    this.getComentarios();

  }


  data_Dashboard(){
     var fecha = new Date();

    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];
    this.current_month = months[fecha.getMonth()];
    this.last_month = months[fecha.getMonth() - 1]
    this.mes_anterior = fecha.getMonth();
    this.mes_actual = fecha.getMonth() + 1;
    this.current_year = fecha.getFullYear();
    this._ventaService.get_data_dashboard().subscribe(
      response => {

        this.ventasData = response.data;

        response.data.forEach(element => {

          if (element.estado == 'Enviado' || element.estado == 'Venta en proceso' || element.estado == 'Finalizado') {


            this.num_ventas = this.num_ventas + 1;

            this.dinero_ganado = this.dinero_ganado + parseInt(element.total_pagado);


            if (element.month == this.mes_actual && element.year == this.current_year) {


              this.total_ventas = this.total_ventas + 1;
              this.total_mes = this.total_mes + element.total_pagado;
            }
            if (element.month == this.mes_anterior && element.year == this.current_year) {
              this.total_ganado_ant = this.total_ganado_ant + element.total_pagado;
              this.total_ventas_ant = this.total_ventas_ant + 1;
            }

            /*AÑO ACTUAL */
            if (element.month == 1 && element.year == this.current_year) {
              this.total_ganado.enero = this.total_ganado.enero + element.total_pagado;
            }
            if (element.month == 2 && element.year == this.current_year) {
              this.total_ganado.febrero = this.total_ganado.febrero + element.total_pagado;
            }
            if (element.month == 3 && element.year == this.current_year) {
              this.total_ganado.marzo = this.total_ganado.marzo + element.total_pagado;
            }
            if (element.month == 4 && element.year == this.current_year) {
              this.total_ganado.abril = this.total_ganado.abril + element.total_pagado;
            }
            if (element.month == 5 && element.year == this.current_year) {
              this.total_ganado.mayo = this.total_ganado.mayo + element.total_pagado;
            }
            if (element.month == 6 && element.year == this.current_year) {
              this.total_ganado.junio = this.total_ganado.junio + element.total_pagado;
            }
            if (element.month == 7 && element.year == this.current_year) {
              this.total_ganado.julio = this.total_ganado.julio + element.total_pagado;
            }
            if (element.month == 8 && element.year == this.current_year) {
              this.total_ganado.agosto = this.total_ganado.agosto + element.total_pagado;
            }
            if (element.month == 9 && element.year == this.current_year) {
              this.total_ganado.septiembre = this.total_ganado.septiembre + element.total_pagado;
            }
            if (element.month == 10 && element.year == this.current_year) {
              this.total_ganado.octubre = this.total_ganado.octubre + element.total_pagado;
            }
            if (element.month == 11 && element.year == this.current_year) {
              this.total_ganado.noviembre = this.total_ganado.noviembre + element.total_pagado;
            }
            if (element.month == 12 && element.year == this.current_year) {
              this.total_ganado.diciembre = this.total_ganado.diciembre + element.total_pagado;
            }

            /*AÑO PASADO */
            if (element.month == 1 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.enero = this.total_ganado_last.enero + element.total_pagado;
            }
            if (element.month == 2 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.febrero = this.total_ganado_last.febrero + element.total_pagado;
            }
            if (element.month == 3 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.marzo = this.total_ganado_last.marzo + element.total_pagado;
            }
            if (element.month == 4 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.abril = this.total_ganado_last.abril + element.total_pagado;
            }
            if (element.month == 5 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.mayo = this.total_ganado_last.mayo + element.total_pagado;
            }
            if (element.month == 6 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.junio = this.total_ganado_last.junio + element.total_pagado;
            }
            if (element.month == 7 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.julio = this.total_ganado_last.julio + element.total_pagado;
            }
            if (element.month == 8 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.agosto = this.total_ganado_last.agosto + element.total_pagado;
            }
            if (element.month == 9 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.septiembre = this.total_ganado_last.septiembre + element.total_pagado;
            }
            if (element.month == 10 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.octubre = this.total_ganado_last.octubre + element.total_pagado;
            }
            if (element.month == 11 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.noviembre = this.total_ganado_last.noviembre + element.total_pagado;
            }
            if (element.month == 12 && element.year == (this.current_year - 1)) {
              this.total_ganado_last.diciembre = this.total_ganado_last.diciembre + element.total_pagado;
            }
          }

        });

      },
      error => {

      }
    );
  }


  data_ventas() {
    this.last_sellers = [];
    this._ventaService.get_detalle_hoy().subscribe(
      response => {

        this.last_sellers = response.data;
        // console.log(response);
      },
      error => {

      }
    );
  }

  getProducts(){
    this._productoService.listar_autocomplete().subscribe(
      response => {
        this.num_productos = response.data.length;
      },
      error => {

      }
    );
  }
  getProductsBstSll(){
    this._productoService.best_seller().subscribe((resp: any) => {
      this.bestsellers = resp.data;
    });
  }
  getProductsPop(){
    this._productoService.populares().subscribe((resp: any) => {
      this.populares = resp.data;
    });
  }
  getComentarios(){
     this._comentarioService.listar().subscribe(
      response => {
        this.num_comentarios = response.comentarios.length;
      },
      error => {

      }
    );

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
      this.ventasDataYear = resp.data;
      console.log(this.ventasDataYear)

    })
  }
}
