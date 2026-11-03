import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor(
    private http: HttpClient
  ) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }

   sincronizarCatalogo(data: any){
    const url = `${base_url}/whatsapp/sincronizar-catalogo`;
    return this.http.post(url, data, this.headers);
  }

  toggleBotStatus(localId: string, estado: boolean): Observable<any> {
    const url = `${base_url}/whatsapp/toggle-bot`;

    const body = {
      local: localId,
      botActivo: estado
    };

    return this.http.put(url, body, this.headers);
  }

  /**
 * Envía una alerta de WhatsApp al cliente final notificándole el estado de su orden
 * @param localId ID de la tienda en MongoDB
 * @param telefono Número del cliente (ej: '54911xxxxxxx')
 * @param estado 'LISTO' o 'DESPACHADO'
 * @param nroPedido Código del ticket de la comanda
 */
notificarCambioEstadoPedido(localId: string, telefono: string, estado: 'LISTO' | 'DESPACHADO', nroPedido: string): Observable<any> {
  const url = `${base_url}/whatsapp/notificar-estado-pedido`;
  const token = localStorage.getItem('token') || '';
  
  const body = {
    local: localId,
    clienteTelefono: telefono,
    estado: estado,
    nroPedido: nroPedido
  };

  return this.http.post(url, body, this.headers);
}
}
