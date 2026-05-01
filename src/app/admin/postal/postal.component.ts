import { Component, OnInit } from '@angular/core';
import { Postal } from "src/app/models/postal.model";
import { PostalService } from "src/app/services/postal.service";
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-postal',
  standalone:false,
  templateUrl: './postal.component.html',
  styleUrls: ['./postal.component.css']
})
export class PostalComponent implements OnInit {

  public postal = new Postal('','','','',null);
  public msm_error = '';
  public postales;
  public identity;
   option_selectedd: number = 1;
  solicitud_selectedd: any = null;
  cargando = false;
  crearNuevo = false;

   activeCategory: any;

  constructor(
    private postalService : PostalService,
    private usuarioService: UsuarioService,
    private router : Router,
    private route :ActivatedRoute,
  ) {
    this.identity = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.crearNuevo = false;
    this.listar();
  }



  onSubmit(postalForm){
    if(postalForm.valid){
      let data = {
        titulo : postalForm.value.titulo,
        tiempo : postalForm.value.tiempo,
        precio : postalForm.value.precio,
        dias : postalForm.value.dias,
      }

      this.postalService.registro(data).subscribe(
        response =>{
          console.log(response);
          this.postal = new Postal('','','','',null);
          this.listar();
        },
        error=>{
          console.log(error);

        }
      );
    }else{
      this.msm_error = 'Complete correctamente el formulario';
    }
  }

  listar(){
    this.postalService.listar().subscribe(
      response =>{
        this.postales = response.postales;
      },
      error=>{
      }
    );
  }

  close_alert(){
    this.msm_error = '';
  }

  eliminar(id) {
      Swal.fire({
        title: 'Estas Seguro?',
        text: 'No podras recuperarlo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.cargando = true;
          this.postalService.eliminar(id)
            .subscribe(resp => {
              this.listar();
            })
          Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
        }
      });
    }

   optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 3) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 4) {
      this.solicitud_selectedd = null;
    }
  }

  

  selectCategory(category: string) {
    this.activeCategory = category;
  }

  optionCrear(){
    this.crearNuevo = true;
  }
  cerrarOptionCrear(){
    this.crearNuevo = false;
  }

}
