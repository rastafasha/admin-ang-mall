import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.mediaUrl;

@Pipe({
  name: 'imagenPipe'
})
export class ImagenPipePipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios'|'categorias'|'marcas'|'productos'|'congenerals'
  |'promocions'|'galerias'|'ingresos'|'facturas'|'blogs' |'pages' |'cursos'|'sliders'): string {

    if(!img){
      return `${base_url}/categorias/no-image.jpg`;
    } else if(img.includes('https')){
      return img;
    } else if(img){
      return `${base_url}/${tipo}/${img}`;
    }else {
      return `${base_url}/marcas/no-image.jpg`;
    }


  }

}
