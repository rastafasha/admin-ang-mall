import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { Categoria } from 'src/app/models/categoria.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IconosService } from 'src/app/services/iconos.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-usertiendaadd',
  templateUrl: './usertiendaadd.component.html',
  styleUrls: ['./usertiendaadd.component.css']
})
export class UsertiendaaddComponent implements OnInit {

  
  public registerForm: FormGroup;
  public categoria: Categoria;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  banner: string;
  pageTitle: string;
  listIcons;
  state_banner:boolean;

  public Editor = ClassicEditor;
  public categoriaSeleccionado: Categoria;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
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
    
    this.validarFormulario();
    // this.activatedRoute.params.subscribe( ({id}) => this.cargarCategoria(id));
    if(this.categoriaSeleccionado){
      //actualizar
    this.pageTitle = 'Edit Categoría';
    
    }else{
      //crear
      this.pageTitle = 'Create Categoría';
      }


  }

  validarFormulario(){
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [ '', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      terminos: [false, Validators.required],
      role: ['false, Validators.required'],

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





  saveEmployee(){

    const {nombre, subcategorias } = this.registerForm.value;

    if(this.categoriaSeleccionado){
      //actualizar
      const data = {
        ...this.registerForm.value,
        _id: this.categoriaSeleccionado._id
      }
      this.categoriaService.actualizarCategoria(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        });

    }else{
      //crear
      this.categoriaService.crearCategoria(this.registerForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/categoria`);
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
    .actualizarFoto(this.imagenSubir, 'categorias', this.categoriaSeleccionado._id)
    .then(img => { this.categoriaSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
