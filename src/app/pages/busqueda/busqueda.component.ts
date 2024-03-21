import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'ngx-pagination/dist/pagination-controls.directive';
import { Blog } from 'src/app/models/blog.model';
import { Curso } from 'src/app/models/curso.model';
import { Producto } from 'src/app/models/producto.model';
import { Slider } from 'src/app/models/slider.model';

import { Usuario } from '../../models/usuario.model';
import { BusquedasService } from '../../services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[]=[];
  public blogs: Blog[]=[];
  public pages: Page[]=[];
  public productos: Producto[]=[];
  public cursos: Curso[]=[];
  public sliders: Slider[]=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
     ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      ({termino}) => {
        this.busquedaGlobal(termino);
      }
    )
  }


  busquedaGlobal(termino: string){
    this.busquedasService.searchGlobal(termino).subscribe(
      (resp:any) => {
        this.usuarios = resp.usuarios;
        this.blogs = resp.blogs;
        this.pages = resp.pages;
        this.productos = resp.productos;
        this.cursos = resp.cursos;
        this.sliders = resp.sliders;
      }
    )
  }


}
