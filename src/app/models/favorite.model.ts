
import { Producto } from './producto.model';
export class Favorite {
    _id: string;
    productId: string;
    productName: string;
    quantity:number;

    constructor(producto: Producto){
      this.productId= producto._id;
      this.productName = producto.titulo;
      this.quantity = 1;
    }
  }
