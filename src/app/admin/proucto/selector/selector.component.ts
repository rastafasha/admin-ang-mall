import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectorService } from "../../../services/selector.service";
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-selector',
  standalone: false,
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit, OnChanges {

  @Input() productoSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshProductList: EventEmitter<void> = new EventEmitter<void>();

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
  pageTitle: string;

  constructor(
    private fb: FormBuilder,
    private _selectorService: SelectorService,
    private _userService: UsuarioService,
  ) {
    this.identity = this._userService.usuario;
  }

  ngOnInit(): void {
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['productoSeleccionado'] &&
      changes['productoSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Selector';
      const producto = changes['productoSeleccionado'].currentValue;
      this.selectorForm.patchValue({
        id: producto._id,
        titulo: producto.titulo,
        producto: producto.producto,
      });

      this.productoSeleccionado = producto;
      this.pageTitle = 'Editando Selector';
    } else {
      this.pageTitle = 'Creando Selector';
    }
    this.get_selector()
  }

  get_selector() {
    this._selectorService.selectorByProduct(this.productoSeleccionado._id).subscribe(
      response => {
        this.selector = response;
      }
    );
  }

  onClose() {
    this.productoSeleccionado = null;
    this.selectorForm.reset();
    this.pageTitle = 'Creando Selector';
    // Also reset default values if needed
    this.selectorForm.patchValue({
      id: null,
      titulo: null,
      producto: null,
    });
    // Emit event to parent to reset the projectSeleccionado variable
    this.refreshProductList.emit();
    this.closeModal.emit();

  }

  validarFormulario() {
    this.selectorForm = this.fb.group({
      titulo: ['', Validators.required],
      producto: ['', Validators.required],
    })
  }

  onSubmit(selectorForm) {

    let data = {
      titulo: this.titulo,
      producto: this.productoSeleccionado._id
    }
    if (selectorForm.valid) {
      this._selectorService.crearSelector(data).subscribe(
        (response:any) => {
          this.selector
          this.titulo = '';
          this.msm_error = '';
          this.get_selector();
        },
        error => {
          this.msm_error = 'Complete correctamente el formulario por favor.'
        }
      )
    } else {
      this.msm_error = 'Complete correctamente el formulario por favor.'
    }
  }

  eliminar(_id: string) {
    this._selectorService.borrarSelector(_id)
      .subscribe(resp => {
        Swal.fire('Borrado', this.selector.titulo, 'success')
        this.get_selector();
      });
  }


}
