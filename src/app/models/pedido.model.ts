import { Direccion } from "./direccion.model";
import { Tienda } from "./tienda.model";
import { Usuario } from "./usuario.model";

export class Pedido{
    constructor(
        public _id: string,
        public user: Usuario,
        public direccion: string,
        public nroPedido: string,
        public pedidoList: Array<any>,
        public tienda: Tienda,
        public status: string,
        public delivery: string,
        public asignado: boolean,
        public verificado: boolean,
        public deliveryAddres: string,
        public createdAt: Date,
        public selector_elegido?: string,
    ){
    }
}