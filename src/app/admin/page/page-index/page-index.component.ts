import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Page } from '../../../models/page.model';

import { PageService } from 'src/app/services/page.service';
import { FormGroup } from '@angular/forms';
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
  
  query:string ='';
    searchForm!:FormGroup;
    currentPage = 1;
    collecion='pages';

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


 public PageSize(): void {
    this.query = '';
    this.loadPages();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.pages) {
      this.pages = event.pages;
    }
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
