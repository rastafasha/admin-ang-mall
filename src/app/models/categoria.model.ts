import { environment } from "src/environments/environment";

const base_url = environment.baseUrl;

export class Categoria{
  constructor(
    public icono : string,
    public nombre: string,
    public state_banner : boolean,
    public subcategorias?: string,
      public img?: string,
    public _id?: string

  ){
  }

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/categorias/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/categorias/${this.img}`;
    }else {
      return `${base_url}/uploads/categorias/no-image.jpg`;
    }

  }
}
