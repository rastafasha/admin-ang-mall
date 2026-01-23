import { Asignacion } from "./asignaciondelivery.model";
import { Usuario } from "./usuario.model";

export class Driver {
     constructor(
        public user: Usuario,
        public tipo_vehiculo: string,
        public placa: string,
        public color: string,
        public year: string,
        public marca: string,
        public modelo: string,
        public asignaciones: Asignacion,
        public status: string,
        public licencianum: string,
        public img?: string,
        public _id?: string

    
      ){
      }
}