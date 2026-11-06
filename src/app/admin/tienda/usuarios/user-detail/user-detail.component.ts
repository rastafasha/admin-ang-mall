import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Direccion } from 'src/app/models/direccion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Cancelacion, Venta } from 'src/app/models/ventas.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detail',
  standalone:false,
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
public usuarioForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;


  public direcciones : Direccion[];

  public cancelacion: Cancelacion;
  public ventas: Venta;

  banner: string;
  pageTitle: string;

  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private _direccionService: DireccionService,
    private ventaService: VentaService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => this.cargarUsuario(id));
    this.activatedRoute.params.subscribe( ({id}) => this.listarDirecciones(id));
    this.activatedRoute.params.subscribe( ({id}) => this.listar_ordenes(id));
    this.activatedRoute.params.subscribe( ({id}) => this.listar_cancelacion(id));

    window.scrollTo(0,0);
    this.validarFormulario();

  }


  validarFormulario(){
    this.usuarioForm = this.fb.group({
      titulo: ['',Validators.required],
      descripcion: ['',Validators.required],
      categoria: ['',Validators.required],
      isFeatured: [''],
      video_review: [''],
    })
  }



  cargarUsuario(_id: string){

    if (_id) {
      this.pageTitle = 'Edit Usuario';
      this.usuarioService.getUserById(_id).subscribe(
        res => {
          this.usuarioForm.patchValue({
            id: res.uid,
            first_name: res.first_name,
            last_name: res.last_name,
            telefono: res.telefono,
            pais: res.pais,
            numdoc: res.numdoc,
            email: res.email,
            role: res.role,
            lang: res.lang,
            google: res.google,
            img : res.img
          });
          this.usuario = res;
        }
      );
    } else {
      this.pageTitle = 'Create Usuario';
    }

  }





  updateBlog(){

    const {first_name, last_name, telefono, pais,  numdoc, email } = this.usuarioForm.value;

    if(this.usuario.uid){
      //actualizar
      const data = {
        ...this.usuarioForm.value,
        _id: this.usuario.uid
      }
      this.usuarioService.guardarUsuario(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${first_name}  actualizado correctamente`, 'success');
          console.log(this.usuario);
        });

    }else{
      return;
    }

  }


  listarDirecciones(_id: string){
    this._direccionService.listarUsuario(_id).subscribe(
      response =>{
        this.direcciones = response.direcciones;
        console.log(this.direcciones);
      },
      error=>{

      }
    );
  }

  listar_ordenes(_id: string){
    this.ventaService.listarporUser(_id).subscribe(
      response=>{
        this.ventas = response.ventas;
        console.log(this.ventas);
      },
      error=>{

      }
    );
  }

  listar_cancelacion(_id: string){
    this.ventaService.listarCancelacionporUser(_id).subscribe(
      response=>{
        this.cancelacion = response.cancelacion;
        console.log(this.cancelacion);
      },
      error=>{

      }
    );
  }


   optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
  }
  

}
