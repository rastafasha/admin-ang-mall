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
  public url;

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private http: HttpClient,
    private _ventaService: VentaService,
    private _comentarioService : ComentarioService,
    private _productoService : ProductoService,
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

          },
          error=>{
          }
        );

  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
