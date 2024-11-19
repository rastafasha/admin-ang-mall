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
import { TiendaService } from 'src/app/services/tienda.service';
import { Tienda } from 'src/app/models/tienda.model';

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
  listIcons: any;
  listTiendas: any;
  user_id: any;
  public localList:any;
  state_banner:boolean;

  public Editor = ClassicEditor;
  public usertiendaSeleccionado: Usuario;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private _iconoService: IconosService,
    private tiendaService: TiendaService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);

    // AGREGADO POR JOSÉ PRADOS
    this.validarFormulario();
    
    // this.activatedRoute.params.subscribe( ({id}) => this.cargar_usuario(id));
    this.activatedRoute.params.subscribe((resp:any)=>{
      this.user_id = resp.id;
      console.log('id: ',this.user_id)
     })
    //  this.cargar_usuario();
    this.cargar_Locales();
    
    if( this.user_id ){
      //actualizar
      this.pageTitle = 'Edit Empleado';
      this.cargar_usuario();
    }
    else{
      //crear
      this.pageTitle = 'Create Empleado';
    }


  }

 
  cargar_usuario(){
    this.usuarioService.getUserById(this.user_id).subscribe(
      (resp:any) =>{
        // this.listIcons = resp.iconos;
        this.usertiendaSeleccionado = resp;
        console.log('editar user: ',this.usertiendaSeleccionado)

        this.registerForm.setValue({
          first_name: this.usertiendaSeleccionado.first_name,
          last_name: this.usertiendaSeleccionado.last_name,
          email: this.usertiendaSeleccionado.email,
          password: '',
          password2: '',
          local: this.usertiendaSeleccionado.local || '',
          role: this.usertiendaSeleccionado.role,
          telefono: this.usertiendaSeleccionado.telefono,
          numdoc: this.usertiendaSeleccionado.numdoc
        });
      }
    )
    // this.validarFormulario();
  }

  validarFormulario(){
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [ '', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      local: ['', Validators.required],
      role: ['', Validators.required],
      telefono: ['', Validators.required],
      numdoc: ['', Validators.required],

    })
  }

  cargar_Locales(){
    this.tiendaService.cargarTiendas().subscribe(
      (resp:any) =>{
        console.log(resp)
        this.listTiendas = resp;

      }
    )
  }



  guardar(){

    const {first_name, last_name,
      email,
      password,
      password2,
      // terminos,
      local,
      role,
      telefono,
      numdoc } = this.registerForm.value;

    if(this.usertiendaSeleccionado){
      // console.log('actualizar')
      //actualizar
      // console.log(this.localList)
      const data = {
        ...this.registerForm.value,
        _id: this.usertiendaSeleccionado.uid,
        // local: this.usertiendaSeleccionado.local,
      }
      console.log('data: ',data)
      this.usuarioService.actualizarPerfil(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${first_name} actualizado correctamente`, 'success');
        }
      );

    }else{
      const data = {
        ...this.registerForm.value,
        // local: this.localList
      }
      console.log('crear');
      //crear
      this.usuarioService.crearUsuario(data)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${first_name} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/tienda-user`);
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
    .actualizarFoto(this.imagenSubir, 'categorias', this.usertiendaSeleccionado.uid)
    .then(img => { this.usertiendaSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
