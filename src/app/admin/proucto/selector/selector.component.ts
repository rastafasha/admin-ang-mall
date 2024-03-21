import { Component, OnInit } from '@angular/core';
import { SelectorService } from "../../../services/selector.service";
import { ActivatedRoute, Router, ChildActivationStart } from '@angular/router';

import Swal from 'sweetalert2';
import { Location } from '@angular/common';

import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  public id;
  public selectores;
  public selector;
  public count_selec;
  public page;
  public pageSize = 12;
  public input_selector;
  public identity;

  public select_producto;

  selectorForm: FormGroup;
  public titulo;
  public msm_error;

  constructor(
    private fb: FormBuilder,
    private _selectorService : SelectorService,
    private _userService: UsuarioService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {
    this.identity = this._userService.usuario;
  }

  ngOnInit(): void {

    this.selectorForm = this.fb.group({
      titulo: ['', Validators.required],
      producto: ['', Validators.required],
    })

    this.activatedRoute.params.subscribe( ({id}) => this.get_selector(id));

  }


  get_selector(_id: string){
    this.selector = [];
    this.select_producto = _id;


    if(_id){
      this._selectorService.selectorByProduct(this.select_producto).subscribe(
        response =>{

          this.selector = response;
          console.log(this.selector);
        }
      );
    }else{
      return;
    }
  }

  onSubmit(selectorForm){

    let data = {
      titulo: this.titulo,
      producto: this.select_producto
    }


    if(selectorForm.valid){
      this._selectorService.crearSelector(data).subscribe(
        response =>{
          this.selector
          this.titulo = '';
          this.msm_error = '';
          this.ngOnInit();
        },
        error=>{
          this.msm_error = 'Complete correctamente el formulario por favor.'
        }
      )

    }else{
      this.msm_error = 'Complete correctamente el formulario por favor.'
    }
  }

  eliminar(_id:string){
    this._selectorService.borrarSelector(_id)
    .subscribe( resp => {
      Swal.fire('Borrado', this.selector.titulo, 'success')
      this.ngOnInit();
    });
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
