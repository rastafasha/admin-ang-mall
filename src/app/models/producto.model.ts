import { environment } from "src/environments/environment";

const base_url = environment.mediaUrl;

export class Producto{
  constructor(

        public titulo: string,
        public precio_ahora: string,
        public precio_antes: string,
        public video_review: string,
        public info_short: string,
        public detalle: string,
        public stock: string,
        public categoria: string,
        public subcategoria: string,
        public nombre_selector: string,
        public marca: string,
        public isFeatured?: boolean,
        public img?: string,
        public _id?: string

  ){}

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/productos/${this.img}`;
    } else if(!`${base_url}/no-image.jpg`){
      return './assets/images/no-image.jpg';
    }else if(!this.img){
      return './assets/images/no-image.jpg';
    }else {
      return `${base_url}/productos/no-image.jpg`;
    }

    

  }
}
