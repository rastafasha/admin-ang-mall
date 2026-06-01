import { environment } from "src/environments/environment";
import { Tienda } from "./tienda.model";

const base_url = environment.mediaUrlRemoto;
export class Transferencia{
  constructor(

        public user: string,
        public bankName: string,
        public metodo_pago: string,
        public amount: number,
        public tasa: number,
        public referencia: string,
        public observaciones: string,
        public paymentday: Date,
        public status: boolean,
        public local: Tienda,
        public createdAt: Date,
        public updatedAt: Date,
        public _id?: string,
        public img?: string

  ){}
   get imagenUrl(){

    if(!this.img){
      return `assets/image/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/usuarios/${this.img}`;
    }else {
      return `${base_url}/uploads/usuarios/no-image.jpg`;
    }

  }

}
