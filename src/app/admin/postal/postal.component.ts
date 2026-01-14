import { Component, OnInit } from '@angular/core';
import { Postal } from "src/app/models/postal.model";
import { PostalService } from "src/app/services/postal.service";
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';


declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-postal',
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
        // console.log(this.postales);

      },
      error=>{

      }
    );
  }

  close_alert(){
    this.msm_error = '';
  }

  eliminar(id){
    this.postalService.eliminar(id).subscribe(
      response =>{
        this.listar();
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
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
    if (this.option_selectedd === 3) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 4) {
      this.solicitud_selectedd = null;
    }
  }

  

  selectCategory(category: string) {
    // console.log('selectCategory called with:', category);
    this.activeCategory = category;
    this.cargando = true
    // this.updateTodo();
    this.cargando = false
  }

  optionCrear(){
    this.crearNuevo = true;
  }
  cerrarOptionCrear(){
    this.crearNuevo = false;
  }

}
