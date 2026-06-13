import { environment } from "src/environments/environment";
import { Categoria } from "./categoria.model";


const base_url = environment.mediaUrlRemoto;

export class Tienda{
  constructor(
    public icono : string,
    public nombre: string,
    public slug: string,
    public local: string,
    public img: string,
    public img_hero: string,

    public descripcion_hero: { es: string; en: string },
    public texto_hero_uno: { es: string; en: string },
    public texto_hero_destacado: { es: string; en: string },
    public texto_hero_dos: { es: string; en: string },
    
    public color_fondo: string,
    public has_reservacion: boolean,
    public capacidad_por_hora: number,
    public redssociales?: string,
    public telefono?: string,
    public productos?: string,
    public direccion?: string,
    public pais?: string,
    public ciudad?: string,
    public moneda?: string,
    public zip?: string,
    public user?: string,
    public categoria?: Categoria,
    public subcategoria?: string,
    public isFeatured?: boolean,
    public iva?: number,
    public status?: 'Desactivado' |'Activo' ,
    //registro para notificaciones
    public whatsappStatus?: 'CONECTADO' |'DESCONECTADO'|'ESPERANDO_QR' ,
    public whatsappQR?: string ,
    public whatsappConnectedAt?: Date ,
    public _id?: string

  ){
  }

  get imagenUrl(){

    if(!this.img){
      return `assets/image/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/locaciones/${this.img}`;
    }else {
      return `${base_url}/uploads/locaciones/no-image.jpg`;
    }

  }
}

