import { environment } from "src/environments/environment";

const base_url = environment.mediaUrlRemoto;

export class Slider{
  constructor(

        public first_title: string,
        public subtitulo: string,
        public enlace: string,
        public target: string,
        public align: string,
        public color: string,
        public status: boolean,
        public mostrarInfo: boolean,
        public mostrarboton: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public img?: string,
        public _id?: string

  ){}

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/sliders/${this.img}`;
    }else {
      return `${base_url}/uploads/sliders/no-image.jpg`;
    }

  }
}
