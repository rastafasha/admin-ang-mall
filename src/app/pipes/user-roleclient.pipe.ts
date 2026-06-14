import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../models/usuario.model';
@Pipe({ name: 'userRoleclientPipe', standalone: false })
export class UserRoleclientPipe implements PipeTransform {
    transform(users: Usuario[] | null): Usuario[] {
        if (!users) return []; 
        return users.filter(
            user => user.role === 'USER' 
        );
    }
}
