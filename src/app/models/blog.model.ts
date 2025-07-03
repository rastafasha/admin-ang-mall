import { environment } from "src/environments/environment";

const base_url = environment.mediaUrlRemoto;

export class Blog{
  constructor(

        public titulo: string,
        public video_review: string,
        public descripcion: string,
        public short_descripcion: string,
        public categoria: string,
        public slug: string,
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
      return `${base_url}/uploads/blogs/${this.img}`;
    }else {
      return `${base_url}/uploads/blogs/no-image.jpg`;
    }

  }
}
