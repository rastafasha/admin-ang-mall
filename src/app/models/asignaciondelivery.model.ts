import { Driver } from "./driverp.model";
import { Pedido } from "./pedido.model";
import { Tienda } from "./tienda.model";

export class Asignacion {
     constructor(
        public driver : Driver,
        public tienda : Tienda,
        public pedido: Pedido,
        public status: string,
        public driverPosition: string,
        public deliveryPosition: string,
        public _id?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    
      ){
      }
}