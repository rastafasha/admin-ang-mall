import { Component, OnInit } from '@angular/core';
import {environment} from 'src/environments/environment';
import { UsuarioService } from '../../../services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-ingreso',
  templateUrl: './detalle-ingreso.component.html',
  styleUrls: ['./detalle-ingreso.component.css']
})
export class DetalleIngresoComponent implements OnInit {

  public url;
  public usuario: Usuario;
  public id;
  public ingreso;
  public detalle;

  constructor(
    private _ingresoService : IngresoService,
    private _route : ActivatedRoute,
    private _router : Router,
    private usuarioService: UsuarioService,
    private location: Location,
  ) {
    this.url = environment.baseUrl;
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._ingresoService.get_data_detalle(this.id).subscribe(
          response=>{
            this.ingreso = response.ingreso;
            this.detalle = response.detalle;
            console.log(response);

          },
          error=>{

          }
        )
      }
    );
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
