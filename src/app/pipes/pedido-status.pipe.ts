import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'pedidoStatus',
  standalone: false 
})
export class PedidoStatusPipe implements PipeTransform {

 /**
   * Filtra un arreglo de pedidos según su estado
   * @param pedidos Lista completa de pedidos desde el backend
   * @param statusEstado El estado por el cual quieres filtrar (ej: 'PENDING', 'INPROCESS')
   */
  transform(pedidos: any[], statusEstado: string): any[] {
    // Si no hay pedidos, devolvemos un arreglo vacío
    if (!pedidos || !pedidos.length) return [];
    
    // Si no se envía un estado para filtrar, devolvemos la lista completa
    if (!statusEstado) return pedidos;

    // Filtramos comparando en mayúsculas para evitar errores tipográficos
    return pedidos.filter(pedido => 
      pedido.status && pedido.status.toUpperCase() === statusEstado.toUpperCase()
    );
  }

}
