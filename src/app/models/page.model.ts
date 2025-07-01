import { environment } from "src/environments/environment";

const base_url = environment.mediaUrlRemoto;

export class Page{
  constructor(

        public titulo: string,
        public slug: string,
        public origen: string,
        public video_review: string,
        public info_short: string,
        public descripcion: string,
        public categoria: string,
        public status: boolean,
        public isFeatured: boolean,
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
      return `${base_url}/uploads/pages/${this.img}`;
    }else {
      return `${base_url}/uploads/pages/no-image.jpg`;
    }

  }
}
