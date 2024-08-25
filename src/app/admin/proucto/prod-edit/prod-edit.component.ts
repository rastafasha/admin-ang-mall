import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { environment } from 'src/environments/environment';

import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ColorService } from 'src/app/services/color.service';
import { SelectorService } from 'src/app/services/selector.service';
import { TiendaService } from 'src/app/services/tienda.service';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-prod-edit',
  templateUrl: './prod-edit.component.html',
  styleUrls: ['./prod-edit.component.css'],
  providers:[
    MarcaService,
    CategoriaService
  ]
})
export class ProdEditComponent implements OnInit {


  public productoForm: FormGroup;
  public producto: Producto;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;
  public listMarcas;
  public listCategorias;
  public colores:any;
  public color_to_cart:any;
  public selectores:any;

  banner: string;
  pageTitle: string;
  producto_id: any;
  listTiendas: any;
  localList: any[];

  public productoSeleccionado: Producto;
  public Editor = ClassicEditor;
  public Editor1 = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private modalImagenService: ModalImagenService,
    private marcaService: MarcaService,
    private categoriaService: CategoriaService,
    private tiendaService: TiendaService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private _colorService: ColorService,
    private _selectorService: SelectorService,
    private sanitizer: DomSanitizer,

  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    // this.activatedRoute.params.subscribe( ({id}) => this.cargarProducto(id));
    // this.activatedRoute.params.subscribe( ({id}) => this.listConfig(id));
    this.activatedRoute.params.subscribe((resp:any)=>{
      this.producto_id = resp.id;
     })

     if(this.producto_id){
      //actualizar
      this.pageTitle = 'Edit Producto';
      this.cargarProducto();
    }else{
      //crear
      this.pageTitle = 'Create Producto';
    }
    this.validarFormulario();

    // this.listConfig()
    
    this.getMarca();
    this.getCategorias();
    this.cargar_Locales();

    

  }

  listConfig(){
    this._colorService.colorByProduct(this.producto_id).subscribe(
      (resp:any) =>{
        console.log(resp);
        // this.colores = resp;
        // this.color_to_cart = this.colores[0].color;

      },
      error=>{

      }
    );

    this._selectorService.selectorByProduct(this.producto_id).subscribe(
      response =>{
        this.selectores = response;
        console.log(response);

      },
      error=>{

      }
    );
  }
  getMarca(){
    this.marcaService.cargarMarcas().subscribe(
      resp =>{
        this.listMarcas = resp;
        // console.log(this.listMarcas)

      }
    )
  }
  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;
        // console.log(this.listCategorias);

      }
    )
  }

  cargar_Locales(){
    this.tiendaService.cargarTiendas().subscribe(
      (resp:any) =>{
        console.log(resp)
        this.listTiendas = resp;

      }
    )
  }

  


  cargarProducto(){

    if(this.producto_id === 'nuevo'){
      return;
    }

    this.productoService.getProductoById(this.producto_id)
    .pipe(
      // delay(100)
      )
      .subscribe( producto =>{
      if(!this.producto_id){
        return this.router.navigateByUrl(`/dasboard/producto`);
      }
        const { titulo, precio_antes,info_short,detalle, stock,categoria,subcategoria,
          nombre_selector,marca,video_review,precio_ahora, isFeatured, local  } = producto;

          

        this.productoSeleccionado = producto;
        console.log(this.productoSeleccionado);

        this.productoForm.setValue({
          titulo, precio_antes,info_short,detalle, stock,categoria,subcategoria,
          nombre_selector,marca,video_review,precio_ahora, isFeatured,
          local
        });

        

      });
      
      this.validarFormulario();
  }

  validarFormulario(){
    this.productoForm = this.fb.group({
      titulo: ['', Validators.required],
      detalle: ['', Validators.required],
      info_short: ['', Validators.required],
      video_review: [''],
      stock: ['', Validators.required],
      precio_ahora: ['', Validators.required],
      precio_antes: ['', Validators.required],
      categoria: ['', Validators.required],
      subcategoria: [''],
      isFeatured: [''],
      marca: ['', Validators.required],
      local: ['', Validators.required],
      nombre_selector: ['', Validators.required]
    })
  }





  updateProducto(){debugger

    const {titulo, precio_antes,info_short, detalle, 
      stock,categoria,subcategoria, 
      nombre_selector,marca,
      video_review,precio_ahora, 
      isFeatured, local 
    } = this.productoForm.value;

    if(this.productoSeleccionado){
      //actualizar
      const data = {
        ...this.productoForm.value,
        _id: this.productoSeleccionado._id,
        local: this.localList,
      }
      this.productoService.actualizarProducto(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
        });

    }else{
      //crear
      const data = {
        ...this.productoForm.value,
        local: this.localList
      }
      this.productoService.crearProducto(data)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/producto`);
      })
    }

  }


  cambiarImagen(file: File){
    this.imagenSubir = file;

    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'productos', this.productoSeleccionado._id)
    .then(img => { this.productoSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
}


}
