import { Component, OnInit } from '@angular/core';
import { Cupon } from 'src/app/models/cupon.model';
import { CategoriaService } from "src/app/services/categoria.service";
import { CuponService } from "../../services/cupons.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';


declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-cupon',
  templateUrl: './cupon.component.html',
  styleUrls: ['./cupon.component.css']
})
export class CuponComponent implements OnInit {

  public cupon = new Cupon('','','',null,'','','');
  public categorias;
  public subcategorias : any = [];
  public msm_error = '';
  public cupones;
  public identity;

  listCategorias;

  constructor(
    private categoriaService : CategoriaService,
    private _cuponService : CuponService,
    private usuarioService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
  ) {
    this.identity = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.listar();
    this.getCategorias();

  }

  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;
        console.log(this.listCategorias)

      }
    )
  }

  generar_cupon(){
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    let result_uno='';
    let result_dos='';

    for ( var i = 0; i < 2; i++ ) {
      result_uno += characters.charAt(Math.floor(Math.random() * charactersLength));
      result_dos += characters.charAt(Math.floor(Math.random() * charactersLength));
    }



    let num = Math.round(Math.random() * (999999999 - 100000000) + 100000000);
    this.cupon.codigo = result_uno+num+result_dos;
  }

  listar(){
    this._cuponService.listar().subscribe(
      response =>{
        this.cupones = response.cupones;
      }
    );
  }

  onSubmit(cuponForm){
    if(cuponForm.valid){
      var data;
      if(cuponForm.value.subcategoria){
        data = {
          categoria :cuponForm.value.categoria,
          subcategoria :cuponForm.value.subcategoria.toString(),
          descuento :cuponForm.value.descuento,
          tipo :cuponForm.value.tipo,
          codigo :cuponForm.value.codigo,
        }
      }else{
        data = {
          categoria :cuponForm.value.categoria,
          subcategoria :'',
          descuento :cuponForm.value.descuento,
          tipo :cuponForm.value.tipo,
          codigo :cuponForm.value.codigo,
        }
      }
      if(data.tipo == 'categoria'){
        if(data.categoria){
          if(data.descuento <= 100){
            this._cuponService.registro(data).subscribe(
              response =>{
                this.cupon = new Cupon('','','',null,'','','');
                this.listar();
              },
              error=>{
                console.log(error);
              }
            );
          }else{
            this.msm_error = 'El porcentaje debe ser inferior al 100';
          }
        }else{
          this.msm_error = 'Seleccione una categoria por favor.'
        }
      }else if(data.tipo == 'subcategoria'){
        if(data.subcategoria){
          if(data.descuento <= 100){
            this._cuponService.registro(data).subscribe(
              response =>{
                this.cupon = new Cupon('','','',null,'','','');
                this.listar();
              },
              error=>{
                console.log(error);

              }
            );
          }else{
            this.msm_error = 'El porcentaje debe ser inferior al 100';
          }
        }else{
          this.msm_error = 'Seleccione una subcategoria por favor.'
        }
      }
    }else{
      this.msm_error = 'Complete correctamente el formulario';
    }

  }

  select_tipo(event,cupon){
    if(cupon == 'categoria'){
      $('#fm-cat').css('display','block');
      $('#fm-sub').css('display','none');

    }else if(cupon == 'subcategoria'){
      $('#fm-cat').css('display','none');
      $('#fm-sub').css('display','block');

    }

  }

  eliminar(id){
    this._cuponService.eliminar(id).subscribe(
      response =>{
        this.listar();
        $('#modal-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
      },
      error=>{

      }
    );
  }

  close_alert(){
    this.msm_error = '';
  }
}
