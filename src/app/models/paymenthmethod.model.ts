import { Tienda } from "./tienda.model";

export class PaymentMethod{
    constructor(
  
          public user: string,
          public username: string,
          public bankAccountType: string,
          public bankName: string,
          public bankAccount: number,
          public ciorif: string,
          public telefono: string,
          public tipo: string,
          public status: string,
          public local: Tienda,
          public email: string,
          public createdAt: Date,
          public updatedAt: Date,
          public _id?: string
  
    ){}
  
  }

  
  