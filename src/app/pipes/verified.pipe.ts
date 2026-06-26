import { Pipe, PipeTransform } from '@angular/core';
import { Pedido } from '../models/pedido.model';
@Pipe({ name: 'verified', standalone: false })
export class VerifiedPipe implements PipeTransform {
    transform(pedidos: Pedido[] | null): Pedido[] {
        if (!pedidos) return []; 
        return pedidos.filter(
            pedi => pedi.verificado === true
        );
    }
}
