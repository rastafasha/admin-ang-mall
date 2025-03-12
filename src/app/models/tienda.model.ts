import { environment } from "src/environments/environment";

const base_url = environment.mediaUrlRemoto;

export class Tienda{
  constructor(
    public icono : string,
    public nombre: string,
    public local: string,
    public state_banner : boolean,
    public redssociales?: string,
    public telefono?: string,
    public productos?: string,
    public direccion?: string,
    public pais?: string,
    public ciudad?: string,
    public zip?: string,
    public user?: string,
    public categoria?: string,
    public subcategoria?: string,
    public isFeatured?: boolean,
    public status?: boolean,
      public img?: string,
    public _id?: string

  ){
  }

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/locaciones/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/locaciones/${this.img}`;
    }else {
      return `${base_url}/uploads/locaciones/no-image.jpg`;
    }

  }
}

