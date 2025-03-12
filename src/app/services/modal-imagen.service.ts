import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios' |'marcas' |'productos' |'blogs' |'pages' |'cursos'|'sliders'|'promocions'|'locaciones';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'marcas'|'productos'|'blogs' |'pages' |'cursos'|'sliders'|'promocions'|'locaciones',
    id: string,
    img: string = 'no-image'
  ){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    if(img.includes('https')){
      this.img = img;
    }else {
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }

  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
