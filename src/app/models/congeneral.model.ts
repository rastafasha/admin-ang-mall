import { environment } from "src/environments/environment";

const base_url = environment.baseUrl;
const mediaUrl = environment.mediaUrl;

export class Congeneral{
  banner: any;
  constructor(
    public titulo: string,
    public cr:  string,
    public telefono_uno: string,
    public telefono_dos: string,
    public email_uno: string,
    public email_dos: string,
    public direccion: string,
    public horarios: string,
    public iframe_mapa: string,
    public facebook: string,
    public instagram: string,
    public youtube: string,
    public language: string,
    public twitter: string,
    public modoPaypal: boolean,
    public rapidapiKey: string,
    public sandbox: string,
    public clientePaypal: string,
    public img?: string,
    public favicon?: string,
    public _id?:string

  ){
  }

  get imagenUrl(){

    if(!this.img){
      return `${mediaUrl}/uploads/congenerals/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${mediaUrl}/uploads/congenerals/${this.img}`;
    }else {
      return `${mediaUrl}/uploads/congenerals/no-image.jpg`;
    }

  }

  get faviconUrl(){

    if(!this.favicon){
      return `${base_url}/uploads/congenerals/no-image.jpg`;
    } else if(this.favicon.includes('https')){
      return this.favicon;
    } else if(this.favicon){
      return `${base_url}/uploads/congenerals/${this.favicon}`;
    }else {
      return `${base_url}/uploads/congenerals/no-image.jpg`;
    }

  }
}
