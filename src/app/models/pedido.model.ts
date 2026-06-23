import { Direccion } from "./direccion.model";
import { Tienda } from "./tienda.model";

export class Pedido{
    constructor(
        public _id: string,
        public user: string,
        public direccion: string,
        public pedidoList: Array<any>,
        public tienda: Tienda,
        public status: string,
        public delivery: string,
        public asignado: boolean,
        public deliveryAddres: string,
        public createdAt: Date,
        public selector_elegido?: string,
    ){
    }
}