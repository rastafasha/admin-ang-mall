import { Component, OnInit } from '@angular/core';
import { VentaService } from "src/app/services/venta.service";
import { ComentarioService } from 'src/app/services/comentario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import {environment} from 'src/environments/environment';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-index-cancelacion',
  templateUrl: './index-cancelacion.component.html',
  styleUrls: ['./index-cancelacion.component.css']
})
export class IndexCancelacionComponent implements OnInit {

  public cancelaciones : Array<any> = [];
  public usuario: Usuario;
  public url;
  public filtro = '';
  public count_cat;

  p: number = 1;
  count: number = 8;

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private http: HttpClient,
    private _ventaService: VentaService,
    private _comentarioService : ComentarioService
  ) {
    this.usuario = this._userService.usuario;
  }

  ngOnInit(): void {
    this.url = environment.baseUrl;
        this.listar();

  }

  filtro_listar(filtro){
    this._ventaService.listar_cancelacion(this.filtro).subscribe(
      response =>{
        this.cancelaciones = response.cancelaciones;
        this.count_cat = this.cancelaciones.length;
      },
      error=>{

      }
    );
  }

  listar(){
    this._ventaService.listar_cancelacion(' ').subscribe(
      response =>{
        this.cancelaciones = response.cancelaciones;
        this.count_cat = this.cancelaciones.length;
        console.log(this.cancelaciones);
      },
      error=>{

      }
    );
  }

}
