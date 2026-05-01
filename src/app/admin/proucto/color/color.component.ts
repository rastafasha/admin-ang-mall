import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ColorService } from "../../../services/color.service";
import { ActivatedRoute, Router, ChildActivationStart } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment';
import { Color } from 'src/app/models/color.model';

declare var jQuery: any;
declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-color',
  standalone: false,
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit, OnChanges {

  @Input() productoSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshProductList: EventEmitter<void> = new EventEmitter<void>();

  public color;
  public usuario: Usuario;
  public colorForm: FormGroup;
  public colorSeleccionado: Color;

  public id;
  public colores;
  public count_color;
  public page;
  public pageSize = 12;
  public titulo;
  public msm_error;
  public pageTitle;

  public select_producto;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private _colorService: ColorService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.validarFormulario()
    
    $('#color-picker').spectrum({
      type: "text",
      togglePaletteOnly: "true",
      change: function (color) {
        $('#color-data').val(color.toHexString());

      }
    });

    

    
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['productoSeleccionado'] &&
      changes['productoSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Color';
      const producto = changes['productoSeleccionado'].currentValue;
      this.colorForm.patchValue({
        id: producto._id,
        titulo: producto.titulo,
        producto: producto.producto,
        color: producto.color
      });

      // this._colorService.colorByProduct(this.productoSeleccionado._id).subscribe(
      //   response => {
      //     this.color = response;
      //     this.titulo = this.color.titulo
      //     this.color = this.color.color
      //     console.log(response)
      //   }
      // );
      this.productoSeleccionado = producto;
      this.pageTitle = 'Editando Color';
    } else {
      this.pageTitle = 'Creando Color';
    }
    this.listar();
    // this.activatedRoute.params.subscribe(({ id }) => this.get_color(id));
    this.get_color()
  }

  onClose() {
    this.productoSeleccionado = null;
    this.colorForm.reset();
    this.pageTitle = 'Creando Proyecto';
    // Also reset default values if needed
    this.colorForm.patchValue({
      id: null,
      titulo: null,
      producto: null,
      color: null
    });
    // Emit event to parent to reset the projectSeleccionado variable
    this.refreshProductList.emit();
    this.closeModal.emit();

  }


  get_color() {
    this.color = [];
    this._colorService.colorByProduct(this.productoSeleccionado._id).subscribe(
      response => {
        this.color = response;
      }
    );
   
  }



  listar() {
    this._colorService.listar(this.productoSeleccionado._id).subscribe(
      response => {
        this.colores = response.colores;
        this.count_color = this.colores.length;
        this.page = 1;
      },
      error => { }
    )
  }

  validarFormulario(){
    this.colorForm = this.fb.group({
      titulo: ['', Validators.required],
      producto: ['', Validators.required],
      color: ['', Validators.required],
    })
  }


  onSubmit(colorForm) {
    if (colorForm.valid) {
      this._colorService.crearColor({ titulo: this.titulo, producto: this.productoSeleccionado._id, color: $('#color-data').val() }).subscribe(
        response => {
          this.color;
           Swal.fire('Color Agregado!', 'Color agregado al producto', 'success');
           this.get_color();
           this.listar();
        },
        error => {
          this.msm_error = 'Complete correctamente el formulario por favor.'
        }
      )

    } else {
      this.msm_error = 'Complete correctamente el formulario por favor.'
    }
  }


  eliminarColor(_id: string) {
    this._colorService.borrarColor(_id)
      .subscribe(resp => {
        Swal.fire('Borrado', this.color.titulo, 'success')
        this.get_color();
        this.listar();
      });

  }


}
