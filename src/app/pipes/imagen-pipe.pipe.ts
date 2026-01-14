import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.mediaUrl;

@Pipe({
  name: 'imagenPipe'
})
export class ImagenPipePipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios'|'tiendas'|'marcas'|'productos'|'congenerals'
  |'promocions'|'galerias'|'ingresos'|
  'facturas'|'blogs' |'pages' |'cursos'
  |'sliders'|'drivers'
): string {

    if(!img){
      return `${base_url}/usuarios/no-image.jpg`;
    } else if(img.includes('https')){
      return img;
    } else if(img){
      return `${base_url}/${tipo}/${img}`;
    }else {
      return `${base_url}/usuarios/no-image.jpg`;
    }


  }

}
