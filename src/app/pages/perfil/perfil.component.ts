import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone:false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  uid:string;
  cargandoImagen = false;
  isDragging = false;

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

    this.getUserRemoto();
    
    this.perfilForm = this.fb.group({
      email: [ this.usuario.email, Validators.required ],
      first_name: [ this.usuario.first_name, Validators.required ],
      lang: [ this.usuario.lang],
      last_name: [ this.usuario.last_name, Validators.required ],
      numdoc: [ this.usuario.numdoc ],
      pais: [ this.usuario.pais],
      telefono: [ this.usuario.telefono ],
      role: [ this.user.role ],
    });

    
  }

  getUserRemoto(){
    this.usuarioService.getUserById(this.user.uid).subscribe((resp:Usuario)=>{
      this.usuario = resp;
    })
  }

  actualizarPerfil(){

    // const {first_name, last_name, telefono, numdoc, lang, pais} = this.perfilForm.value;

    const data = {
      uid: this.usuario.uid,
      ...this.perfilForm.value
    }
    

    this.usuarioService.actualizarPerfil(data)
    .subscribe((resp:any) => {
      resp
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
    .actualizarFoto(this.imagenSubir, 'usuarios', this.user.uid)
    .then(img => { this.usuario.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    })
  }



    onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.cambiarImagen(files[0]);
    }
  }
  
  onFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      this.cambiarImagen(file);
    }
  }

}
