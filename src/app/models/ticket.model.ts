export class Ticket {
  tema:string;
  estado: number;
  status:number;
  user:string;
  venta:string;
  _id:string;
  createdAt:Date;
}

export class Mensaje {
  de:string;
  para:string;
  msn: number;
  ticket:string;
  _id:string;
  createdAt:Date;
}
