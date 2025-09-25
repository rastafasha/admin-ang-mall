import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';


import { BlogService } from '../../../services/blog.service';
import { Router } from '@angular/router';
import { Blog } from 'src/app/models/blog.model';
import { FormGroup } from '@angular/forms';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-blog-index',
  templateUrl: './blog-index.component.html',
  styleUrls: ['./blog-index.component.css']
})
export class BlogIndexComponent implements OnInit {

  public blog: Blog;
  public blogs: Blog;
  public cargando: boolean = true;

  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  error: string;
  msm_error: string;

  public imgSubs: Subscription;

  query:string ='';
    searchForm!:FormGroup;
    currentPage = 1;
    collecion='blogs';

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadBlogs();

  }

  loadBlogs(){
    this.cargando = true;
    this.blogService.getBlogs().subscribe(
      blogs => {
        this.cargando = false;
        this.blogs = blogs;
        console.log(this.blogs);
      }
    )

  }



  eliminarBlog(_id: string){

    this.blogService.borrarBlog(_id).subscribe(
      response =>{
        this.loadBlogs();
        $('#delete-'+_id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        $('.fix-header').removeClass('modal-open');
      },
      error=>{
        this.msm_error = 'No se pudo eliminar el curso, vuelva a intentar.'
      }
      );
      this.ngOnInit();
  }



  public PageSize(): void {
    this.query = '';
    this.loadBlogs();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.blogs) {
      this.blogs = event.blogs;
    }
  }
  editarId(_id:string ) {
    this.blogService.getBlogById(_id).subscribe(
      res =>{
        this.router.navigateByUrl('/dashboard/blog/edit/'+_id);

      }
    );
  }

  desactivar(id){
    this.blogService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadBlogs();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el curso, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.blogService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadBlogs();
      },
      error=>{


        this.msm_error = 'No se pudo activar el curso, vuelva a intenter.'
      }
    )
  }

}
