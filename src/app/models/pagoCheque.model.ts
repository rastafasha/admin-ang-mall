export class PagoCheque{
  constructor(

        public name_person: string,
        public amount: number,
        public phone: string,
        public ncheck: string,
        public status: boolean,
        public paymentday: Date,
        public createdAt: Date,
        public updatedAt: Date,
        public _id?: string

  ){}

}
