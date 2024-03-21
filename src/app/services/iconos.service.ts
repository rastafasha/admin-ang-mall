import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Icons } from '../models/Icons';



@Injectable()
export class IconosService {

  listIcons: Icons;
  icons:any;
  cargada:boolean = false;

  constructor( public http: HttpClient ) {

    this.cargar_iconos();

  }

  public cargar_iconos(){
    this.http.get( "assets/data/data-iconos.json" )
      .subscribe( (icons:any) =>{
        this.cargada = true;
        this.icons = icons.iconos;
      } )

  }

  getIcons() {
    return this.http.get<Icons>('assets/data/data-iconos.json');
  }


}
