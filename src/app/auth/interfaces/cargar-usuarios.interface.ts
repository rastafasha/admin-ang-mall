import { Usuario } from "src/app/models/usuario.model";

export interface CargarUsuario{
  clients: any;
  employees: any;
  almacenusers: any;
  tiendausers: any;
  total: number;
  usuarios: Usuario[];
}