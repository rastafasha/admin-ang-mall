import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Page } from '../../../models/page.model';

import { PageService } from 'src/app/services/page.service';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-page-index',
  templateUrl: './page-index.component.html',
  styleUrls: ['./page-index.component.css']
})
export class PageIndexComponent implements OnInit {

  public page: Page;
  public pages: Page;
  public cargando: boolean = true;

  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  error: string;
  public msm_error;

  public imgSubs: Subscription;

  constructor(
    private pageService: PageService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadPages();

  }

  loadPages(){
    this.cargando = true;
    this.pageService.getPages().subscribe(
      pages => {
        this.cargando = false;
        this.pages = pages;
        console.log(this.pages);
      }
    )

  }

  guardarCambios(id: number){

    // if(id){
    //   this.blogService.updateBlog(this.blog.id)
    //   .subscribe( resp => {
    //     Swal.fire('Actualizado',  'success')
    //   })

    // }

  }


  // eliminarPage(id: number){

  //   this.pageService.deletePage(+id).subscribe(
  //     response =>{
  //       this.loadPages();
  //       $('#delete-'+id).modal('hide');
  //       $('.modal-backdrop').removeClass('show');
  //       $('.fix-header').removeClass('modal-open');
  //     },
  //     error=>{
  //       this.msm_error = 'No se pudo eliminar el curso, vuelva a intentar.'
  //     }
  //   );

  //   this.ngOnInit();
  // }

  eliminarPage(_id: string){

    if (confirm('Are you sure want to delete id = ' + _id)) {
      this.pageService.borrarPage(_id).subscribe(
        res => {
          console.log(res);
          Swal.fire('Borrado', 'success')
          this.ngOnInit();
        },
        error => this.error = error
      );
    }
    this.ngOnInit();
  }



  buscar(termino: string){

    // if(termino.length === 0){
    //   return this.loadPromocions();
    // }

    // this.busquedaService.buscar('promocions', termino)
    // .subscribe( resultados => {
    //   resultados;
    // })
  }

  desactivar(id){
    this.pageService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadPages();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el curso, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.pageService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadPages();
      },
      error=>{


        this.msm_error = 'No se pudo activar el curso, vuelva a intenter.'
      }
    )
  }


}
