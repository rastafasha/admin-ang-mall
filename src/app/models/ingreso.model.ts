import { environment } from "src/environments/environment";

const base_url = environment.baseUrl;
export class Ingreso {
  constructor(
    public user: string,
    public factura: string,
    public total_pagado: string,
    public proveedor: string,
    public nota: string,
    public detalles: string,
    public img?: string,
    public _id?: string
  ){}

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/ingresos/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/ingresos/${this.img}`;
    }else {
      return `${base_url}/uploads/ingresos/no-image.jpg`;
    }

  }




}
