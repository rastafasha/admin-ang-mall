import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  uid:string;

  user:any=[];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    
    this.user = JSON.parse(user);

    this.usuario
    console.log(this.usuario);
    console.log(this.user);

    this.getUserRemoto();
    
    this.perfilForm = this.fb.group({
      email: [ this.usuario.email, Validators.required ],
      first_name: [ this.usuario.first_name, Validators.required ],
      last_name: [ this.usuario.last_name, Validators.required ],
      numdoc: [ this.usuario.numdoc ],
      telefono: [ this.usuario.telefono ],
      pais: [ this.usuario.pais],
      lang: [ this.usuario.lang],
      google: [ this.usuario.google],
      role: [ this.usuario.role],
      uid: [ this.user.uid],
    });

    
  }

  getUserRemoto(){
    this.usuarioService.getUserById(this.user.uid).subscribe((resp:Usuario)=>{
      this.user = resp;
    })
  }

  actualizarPerfil(){debugger


    this.usuarioService.upadateUser(this.perfilForm.value, this.user.uid)
    .subscribe((resp:any) => {
      const {first_name, last_name, telefono, pais,  numdoc, lang,   email, uid} = this.perfilForm.value;
      this.usuario.first_name = first_name;
      this.usuario.last_name = last_name;
      this.usuario.telefono = telefono;
      this.usuario.numdoc = numdoc;
      this.usuario.lang = lang;
      this.usuario.pais = pais;
      this.user.uid = uid;
      Swal.fire('Guardado', 'Los cambios fueron actualizados', 'success');
    }, (err)=>{
      Swal.fire('Error', err.error.msg, 'error');

    })
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
    .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then(img => { this.usuario.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    })
  }

}
