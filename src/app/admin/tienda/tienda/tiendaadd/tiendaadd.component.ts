import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IconosService } from 'src/app/services/iconos.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Tienda } from 'src/app/models/tienda.model';
import { TiendaService } from 'src/app/services/tienda.service';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-tiendaadd',
  templateUrl: './tiendaadd.component.html',
  styleUrls: ['./tiendaadd.component.css']
})
export class TiendaaddComponent implements OnInit {

  

  public tiendaForm: FormGroup;
  public tienda: Tienda;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  banner: string;
  pageTitle: string;
  listIcons;
  state_banner:boolean;


  // public Editor = ClassicEditor;
  // public Editor1 = ClassicEditor;
  public tiendaSeleccionado?: Tienda;

  public redessociales:any = [];
  public listCategorias:any = [];
  public icono:any;
  description:any;
  name_red:any;
  usuario_red:any;

  nombre:any; local:any; 
  categoria:any; subcategorias:any; 
          telefono:any; user:any; 
          redssociales:any; status:any;  

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private tiendaService: TiendaService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private _iconoService: IconosService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);

    this.cargar_iconos();
    this.getCategorias();
    
    this.validarFormulario();
    this.activatedRoute.params.subscribe( ({id}) => this.cargarTienda(id));
    if(this.tiendaSeleccionado){
      //actualizar
    this.pageTitle = 'Edit Tienda';
    
    }else{
      //crear
      this.pageTitle = 'Crear Tienda';
      }


  }



  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;
        // console.log(this.listCategorias);

      }
    )
  }

  // addRedSocial(){
  //   this.redssociales.push({
  //     name_red: this.name_red,
  //     usuario_red: this.usuario_red,
  //     icono: this.icono
  //   })
  //   this.name_red = '';
  //   this.usuario_red = '';
  //   this.icono = '';
  // }


  addRedSocial() {
    if (this.redssociales) {
      this.redssociales.push({
        index: this.redssociales.length + 1,
        name_red: this.name_red,
        usuario_red: this.usuario_red,
        icono: this.icono
      });
    } else {
      this.redssociales = [
        {
          index: 1, // initial index
          name_red: this.name_red,
          usuario_red: this.usuario_red,
          icono: this.icono
        },
      ];
    }
    this.name_red = '';
    this.usuario_red = '';
    this.icono = '';
    }

  deleteMedical(i:any){
    this.redssociales.splice(i,1);
  }

  

  validarFormulario(){
    this.tiendaForm = this.fb.group({
      nombre: ['', Validators.required],
      local: ['', Validators.required],
      telefono: ['', ],
      categoria: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: ['', Validators.required],
      ciudad: ['', Validators.required],
      zip: ['', Validators.required],
      subcategoria: [''],
      redssociales: [this.redessociales],
      status: ['false', Validators.required],
      state_banner: ['false', Validators.required],
      isFeatured: ['false', Validators.required],
      user: [this.usuario.uid],
    })
  }

  cargar_iconos(){
    this._iconoService.getIcons().subscribe(
      (resp:any) =>{
        this.listIcons = resp.iconos;
        // console.log(this.listIcons.iconos)

      }
    )
  }

  cargarTienda(_id: string){


    if (_id !== null && _id !== undefined) {
      this.pageTitle = 'Edit Usuario';
      this.tiendaService.getTiendaById(_id).subscribe(
        res => {
          this.tiendaForm.patchValue({
            id: res._id,
            nombre: res.nombre,
            local: res.local,
            telefono: res.telefono,
            categoria: res.categoria,
            direccion: res.direccion,
            pais: res.pais,
            ciudad: res.ciudad,
            zip: res.zip,
            subcategoria: res.subcategoria,
            redssociales: res.redssociales,
            status: res.status,
            state_banner: res.state_banner,
            img : res.img
          });
          this.tiendaSeleccionado = res;
          console.log(this.tiendaSeleccionado);
          // console.log(this.tiendaSeleccionado.redssociales);
          this.redssociales = this.tiendaSeleccionado.redssociales;
        }
      );
    } else {
      this.pageTitle = 'Create Usuario';
    }

    

  }




  saveTienda(){

    const {
      nombre, 
      local,
      telefono,
      categoria,
      direccion,
      pais,
      ciudad,
      zip,
      subcategoria,
      redssociales,
      status,
      state_banner,
      isFeatured,
      user,
     } = this.tiendaForm.value;

    if(this.tiendaSeleccionado){
      //actualizar
      const data = {
        ...this.tiendaForm.value,
        _id: this.tiendaSeleccionado._id,
        // user: this.usuario.uid
      }
      this.tiendaService.actualizarTienda(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        });

    }else{
      //crear
      this.tiendaService.crearTienda(this.tiendaForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/tienda`);
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
    .actualizarFoto(this.imagenSubir, 'locaciones', this.tiendaSeleccionado._id)
    .then(img => { this.tiendaSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
