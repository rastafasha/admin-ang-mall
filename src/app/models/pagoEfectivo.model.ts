export class PagoEfectivo{
  constructor(

    public amount: number,
    public name_person: string,
        public phone: string,
        public status: boolean,
        public paymentday: Date,
        public createdAt: Date,
        public updatedAt: Date,
        public _id?: string

  ){}

}
