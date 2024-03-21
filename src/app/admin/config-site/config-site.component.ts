import { Component, OnInit, DoCheck } from '@angular/core';
import {environment} from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Congeneral } from 'src/app/models/congeneral.model';
import { CongeneralService } from 'src/app/services/congeneral.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-config-site',
  templateUrl: './config-site.component.html',
  styleUrls: ['./config-site.component.css']
})
export class ConfigSiteComponent implements OnInit {


  pageTitle: string;
  public confGeneralForm: FormGroup;
  public congeneral: Congeneral;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public imagenSubir1: File;
  public imgTemp1: any = null;
  public configCreated: any;

  public Editor = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private congeneralService: CongeneralService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {
    this.usuario = usuarioService.usuario;
    this.congeneral = congeneralService.congeneral;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {

    window.scrollTo(0,0);

    this.activatedRoute.params.subscribe( ({id}) => this.cargarConf(id));

    this.validarFormulario();

  }

  validarFormulario(){
    this.confGeneralForm = this.fb.group({
      titulo: ['', Validators.required],
      cr: ['', Validators.required],
      telefono_uno: ['', Validators.required],
      telefono_dos: ['',],
      email_uno: ['', Validators.required],
      email_dos: ['', ],
      direccion: ['', Validators.required],
      horarios: ['', Validators.required],
      iframe_mapa: ['', ],
      facebook: ['', ],
      instagram: ['', ],
      youtube: ['', ],
      twitter: ['', ],
      language: ['', Validators.required],
      modoPaypal: ['', Validators.required],
      sandbox: ['',],
      clientePaypal: ['',],
      rapidapiKey: [''],
    });
  }




  cargarConf(_id: string){

    if (_id) {
      this.pageTitle = 'Editing';
      this.congeneralService.getCongeneralById(_id).subscribe(
        res => {
          this.confGeneralForm.patchValue({
            id: res._id,
            titulo: res.titulo,
            cr: res.cr,
            telefono_uno: res.telefono_uno,
            telefono_dos: res.telefono_dos,
            email_uno: res.email_uno,
            email_dos: res.email_dos,
            direccion: res.direccion,
            horarios: res.horarios,
            iframe_mapa: res.iframe_mapa,
            facebook: res.facebook,
            instagram: res.instagram,
            youtube: res.youtube,
            twitter: res.twitter,
            language: res.language,
            modoPaypal: res.modoPaypal,
            sandbox: res.sandbox,
            clientePaypal: res.clientePaypal,
            rapidapiKey: res.rapidapiKey,
            user_id: this.usuario.uid,
            img : res.img,
            favicon : res.favicon
          });
          this.congeneral = res;
          console.log(this.congeneral);
        }
      );
    } else {
      this.pageTitle = 'Create ';
    }

  }



  updateConfiguracion(){debugger
    const {titulo, cr, telefono_uno,telefono_dos, email_uno,
      email_dos, direccion, horarios, iframe_mapa, facebook,
      instagram, youtube, twitter, language, modoPaypal,
      sandbox,clientePaypal,rapidapiKey} = this.confGeneralForm.value;

      if(this.confGeneralForm){
        //actualizar
        const data = {
          ...this.confGeneralForm.value,
          _id: this.congeneral._id
        }
        this.congeneralService.actualizarCongeneral(data).subscribe(
          resp =>{
            Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
            console.log(this.congeneral);
          });

      }else{
        // return 'No hay Id';
        this.congeneralService.crearCongeneral(this.confGeneralForm.value)
        .subscribe( (resp: any) =>{
          Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
          // this.router.navigateByUrl(`/dashboard/account-settings`);
          this.configCreated = resp;
          console.log(resp);
          this.ngOnInit();
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
    .actualizarFoto(this.imagenSubir, 'congenerals', this.congeneral._id)
    .then(img => {
      this.congeneral.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })

  }

  cambiarImagen1(file: File){
    this.imagenSubir1 = file;

    if(!file){
      return this.imgTemp1 = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () =>{
      this.imgTemp1 = reader.result;
    }
  }

  subirImagen1(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir1, 'congenerals', this.congeneral._id)
    .then(img => {
      this.congeneral.favicon = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })

  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }


}
