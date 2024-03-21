import { environment } from "src/environments/environment";
import { Videogaleria } from "./videogaleria.model";

const base_url = environment.baseUrl;

export class Curso{
  constructor(

        public titulo: string,
        public precio_ahora: string,
        public precio_antes: string,
        public video_review: string,
        public info_short: string,
        public detalle: string,
        public categoria: string,
        public isFeatured: boolean,
        public status: string,
        public videos: Videogaleria,
        public img?: string,
        public _id?: string

  ){}

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/cursos/${this.img}`;
    }else {
      return `${base_url}/uploads/cursos/no-image.jpg`;
    }

  }
}
