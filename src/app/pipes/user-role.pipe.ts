import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../models/usuario.model';
@Pipe({ name: 'userRolePipe', standalone: false })
export class UserRolePipe implements PipeTransform {
    transform(users: Usuario[] | null): Usuario[] {
        if (!users) return []; 
        return users.filter(
            user => user.role === 'ADMIN' 
            || user.role === 'VENTAS'
            || user.role === 'TIENDA'
            || user.role === 'ALMACEN'
            || user.role === 'CHOFER'
        );
    }
}
