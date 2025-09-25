export class PagoCheque{
  constructor(

        public name_person: string,
        public phone: string,
        public ncheck: string,
        public amount: number,
        public status: boolean,
        public paymentday: Date,
        public createdAt: Date,
        public updatedAt: Date,
        public _id?: string

  ){}

}
