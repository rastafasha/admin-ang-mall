import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const base_url = environment.mediaUrl;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {


  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'marcas' |'productos' | 'congenerals'|'promocions' |'galerias'|'ingresos'
    |'blogs' |'pages' |'cursos' |'sliders' | 'locaciones' 
    |'facturas' | 'categorias' | 'drivers',
    id: string,
    campo?: 'img' | 'img_hero' // 🛠️ Nuevo parámetro opcional
  ){

    try{

      let url = `${base_url}/${tipo}/${id}`;
      if (campo) {
        url += `?campo=${campo}`; // 👉 Esto genera /api/upload/locaciones/ID?campo=img_hero
      }
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url,{
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if(data.ok){
        return data.nombreArchivo;

      }else{
        console.log(data.msg);
        return false;

      }

    }catch(error){
      console.log(error);
      return false;
    }

  }

}
