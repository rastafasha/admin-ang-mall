import { Driver } from "./driverp.model";
import { Tienda } from "./tienda.model";
import { Venta } from "./ventas.model";

export class Asignacion {
     constructor(
        public driver : Driver,
        public tienda : Tienda,
        public venta: Venta,
        public status: string,
        public driverPosition: string,
        public deliveryPosition: string,
        public _id?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    
      ){
      }
}