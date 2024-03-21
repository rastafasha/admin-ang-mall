import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { GaleriaService } from 'src/app/services/galeria.service';
import {environment} from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { ProductoService } from 'src/app/services/producto.service';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public id;
  public imagenes : any = [];
  public files: File[] = [];
  public msm_error=false;
  public url;
  public count_img;
  public identity;

  public galerias : any ;
  public galeria : Array<any> = [];
  public select_producto;
  public first_img;

  public imgSelect : String | ArrayBuffer;
  public producto:Producto;
  public imagenSubir: File;


  p: number = 1;
  count: number = 8;

  constructor(
    private galeriaService : GaleriaService,
    private _router : Router,
    private _userService: UsuarioService,
    private fileUploadService: FileUploadService,
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,

  ) {
    this.url = environment.baseUrl;
    this.identity = this._userService.usuario;
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => this.get_galeria(id));
    this.activatedRoute.params.subscribe( ({id}) => this.cargarProducto(id));
  }

  close_toast(){
    /* $('#dark-toast').removeClass('show');
        $('#dark-toast').addClass('hide'); */
  }

  close_modal(){
    $('#addimg').modal('hide');
    this.files = [];
  }

  close_alert(){
    this.msm_error = false;
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    console.log(this.files);

  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  get_galeria(_id: string){
    this.galeria = [];
    this.select_producto = _id;


    if(_id){
      this.galeriaService.find_by_product(this.select_producto).subscribe(
        response =>{

          response.galeria.forEach((element,index) => {
            if(index == 0){
              this.first_img = element.imagen;
            }
              this.galeria.push({_id:element._id,imagen : element.imagen});
          });
          console.log(this.galeria);
        },
        error=>{


        }
      );
    }else{
      return;
    }
  }


  cargarProducto(_id: string){
    this.productoService.getProductoById(_id).subscribe(
      response =>{
        this.producto = response;
        console.log(this.producto);
      },
      error=>{

      }
    );
  }

  onSubmit(galeriaForm){

      const data = {
        imagenes : this.files,
        producto : this.producto._id
      }

      if(this.producto){
        this.galeriaService.registro(data).subscribe(
          response =>{
            this.subirImagen();
            this.close_modal();
            this.ngOnInit();


          },
          error=>{
            this.msm_error = true;
          }
        );
      }

  }





  listar(){
    this.activatedRoute.params.subscribe(
      params=>{
        this.id = params['id'];
        this.galeriaService.get_cupon(this.id).subscribe(
          response=>{
            this.imagenes = response.imagenes;
            this.count_img = this.imagenes.length;
          },
          error=>{

          }
        )
      }
    );
  }


  eliminar(id){
    this.galeriaService.eliminar(id).subscribe(
      response=>{

        $('#modal-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.listar();

      },
      error=>{

      }
    );
  }

  subirImagen(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'galerias', this.producto._id)
    .then(img => { this.producto.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

}
