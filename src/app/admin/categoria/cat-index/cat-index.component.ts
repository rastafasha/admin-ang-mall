import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { IconosService } from 'src/app/services/iconos.service';
import { FormGroup } from '@angular/forms';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-cat-index',
  templateUrl: './cat-index.component.html',
  styleUrls: ['./cat-index.component.css']
})
export class CatIndexComponent implements OnInit {

  public categorias: Categoria[] =[];
  public categoria: Categoria;
  public cargando: boolean = true;

  public totalCategorias: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  listIcons;

  query:string ='';
        searchForm!:FormGroup;
        currentPage = 1;
        collecion='categorias';

  public msm_error;

  constructor(
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
    private _iconoService: IconosService,
  ) { }

  ngOnInit(): void {
    this.cargar_iconos();

    this.loadCategorias();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(banner => { this.loadCategorias();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadCategorias(){
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.cargando = false;
        this.categorias = categorias;
      }
    )

  }

  cargar_iconos(){
    this._iconoService.getIcons().subscribe(
      resp =>{
        this.listIcons = resp;
        console.log(this.listIcons.iconos)

      }
    )
  }

  guardarCambios(categoria: Categoria){
    this.categoriaService.actualizarCategoria(categoria)
    .subscribe( resp => {
      Swal.fire('Actualizado', categoria.nombre,  'success')
    })

  }


  eliminarCategoria(categoria: Categoria){
    this.categoriaService.borrarCategoria(categoria._id)
    .subscribe( resp => {
      this.loadCategorias();
      Swal.fire('Borrado', categoria.nombre, 'success')
    })

  }

public PageSize(): void {
    this.query = '';
    this.loadCategorias();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.categorias) {
      this.categorias = event.categorias;
    }
  }

  desactivar(id){
    this.categoriaService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadCategorias();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el producto, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.categoriaService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadCategorias();
      },
      error=>{


        this.msm_error = 'No se pudo activar el producto, vuelva a intenter.'
      }
    )
  }

}
