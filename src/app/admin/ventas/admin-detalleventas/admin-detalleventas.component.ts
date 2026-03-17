import { Component, OnInit } from '@angular/core';
import {environment} from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VentaService } from "src/app/services/venta.service";
import { ComentarioService } from "src/app/services/comentario.service";
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Location } from '@angular/common';
import { Venta } from 'src/app/models/ventas.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Tienda } from 'src/app/models/tienda.model';
import { TiendaService } from 'src/app/services/tienda.service';

@Component({
  selector: 'app-admin-detalleventas',
  templateUrl: './admin-detalleventas.component.html',
  styleUrls: ['./admin-detalleventas.component.css']
})
export class AdminDetalleventasComponent implements OnInit {

  public identity;
  public id;
  public detalle : any = {};
  public venta : Venta;
  public user : Usuario;
  public url;
  public tienda:Tienda;
    public tienda_moneda:string;
    public local:string;

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private http: HttpClient,
    private _ventaService: VentaService,
    private tiendaService : TiendaService,
    private location: Location,
  ) {
    this.identity = this._userService.usuario;
    this.url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.url = environment.baseUrl;
        this._route.params.subscribe(
          params=>{
            this.id = params['id'];
          }
        );
        this._ventaService.detalle(this.id).subscribe(
          (resp:any) =>{
            console.log(resp);
            this.detalle = resp.detalle;
            this.venta = resp.venta;
            this.user = resp.venta.user;

            this.local= resp.venta.local;
        this.getTiendaId()

          },
          error=>{
          }
        );

  }

  getTiendaId(){
    this.tiendaService.getTiendaById(this.local).subscribe((resp:any)=>{
      this.tienda = resp;
      this.tienda_moneda = this.tienda.moneda
    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
