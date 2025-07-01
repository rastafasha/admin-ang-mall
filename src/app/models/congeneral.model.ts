import { environment } from "src/environments/environment";

const base_url = environment.baseUrl;
const mediaUrl = environment.mediaUrlRemoto;

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
    public redessociales: Redes,
    public lang: string,
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
export class Redes{
  id:string;
  title: string;
  url: string;
  icono: string;
  constructor(
    id: string,
    title: string,
    url: string,
    icono: string
  ){
    this.id = id;
    this.title = title;
    this.url = url;
    this.icono = icono;
  }
}
