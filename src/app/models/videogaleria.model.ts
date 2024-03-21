import { Curso } from "./curso.model";


export class Videogaleria{
  constructor(

    public urlYoutube: string,
    public urlVimeo: string,
    public titulo: string,
    public fileVideo: string,
    public curso: Curso,
    public status: string,
    public updatedAt: Date,
    public createdAt: Date,
    public img?: string,
    public _id?: string

  ){}


}
