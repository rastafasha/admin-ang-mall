import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Presupuesto } from 'src/app/models/presupuesto';
import { PresupuestoService } from 'src/app/services/presupuesto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var bootstrap: any;
@Component({
  selector: 'app-cotizacion-edit',
  standalone:false,
  templateUrl: './cotizacion-edit.component.html',
  styleUrl: './cotizacion-edit.component.css'
})
export class CotizacionEditComponent implements OnChanges {
  @Input() presupuestoSeleccionado!: any;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() reloadList: EventEmitter<void> = new EventEmitter<void>();

  public presupuestoForm!: FormGroup;
  public presupuesto!: Presupuesto;
  pageTitle!: string;
  public medical: any = [];
  description: any;
  name_medical: any;
  precio!: number;
  cantidad!: number;
  amount = 0;
  user: any;
  presupuesto_id!: string;
  isLoading = false;
  isEditing = false;
  public clientes: any = [];
  usuarioSelected: any;
  cliente: any;
  

  constructor(
    public presupuestoService: PresupuestoService,
    public usuarioService: UsuarioService,
    public router: Router,
    public toastr: ToastrService,
    public fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.validarFormulario();
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.getClientes();
  }

  getClientes(){
    this.usuarioService.cargarEmployeesTienda(this.user.local).subscribe(local=>{
      this.clientes = local;
      console.log(local)
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.isLoading = true;

    if (
      changes['presupuestoSeleccionado'] &&
      changes['presupuestoSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Presupuesto';
      const presupuesto = changes['presupuestoSeleccionado'].currentValue;
      this.cliente = presupuesto.cliente?.uid || presupuesto.cliente || '';
      this.amount = presupuesto.amount || presupuesto.amount || '';
      this.medical = presupuesto.listItems || presupuesto.listItems || '';

      this.presupuestoForm.patchValue({
        id: presupuesto._id,
        title: presupuesto.title,
        description: presupuesto.description,
        amount: this.amount,
        status: presupuesto.status,
        cliente: this.cliente,
        medical: this.medical,
        usuario: this.user.uid,
      });
      this.presupuestoSeleccionado = presupuesto;
      this.isEditing = true;
      this.pageTitle = 'Editando Presupuesto';
    } else {
      this.isEditing = false;
      this.pageTitle = 'Creando Presupuesto';
    }
    this.isLoading = false;
  }


  onClose() {
    this.presupuestoSeleccionado = null;
    this.presupuestoForm.reset();
    this.pageTitle = 'Creando Presupuesto';
    // Also reset default values if needed
    this.presupuestoForm.patchValue({
      id: null,
      title: null,
      description: null,
      amount: null,
      status: null,
      cliente: null,
      listItems: [],
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  validarFormulario() {
    this.presupuestoForm = this.fb.group({
      title: [''],
      surname: [''],
      status: [''],
      cliente: [''],
      description: [''],
    })
  }


  clienteSelected(documentId: any) {
    this.usuarioSelected = documentId;
  }

 

  addMedicamento() {
    if (this.name_medical && this.precio > 0) {
      this.medical.push({
        name_medical: this.name_medical,
        cantidad: this.cantidad + '',
        precio: this.precio + ''
      });
      this.name_medical = '';
      this.precio = 0;
      this.cantidad = 0;
      this.amount = 0;

    }
    this.amount = 0;
    for (let i = 0; i < this.medical.length; i++) {
      this.amount += parseFloat(this.medical[i].precio) * parseFloat(this.medical[i].cantidad);
    }
  }

  deleteMedical(i: any) {
    this.medical.splice(i, 1);
    this.name_medical = '';
    this.precio = 0;
    this.amount = 0;
    this.cantidad = 0;


    if (this.medical.length === 0) {
      this.name_medical = '';
      this.precio = 0;
      this.cantidad = 0;
      this.amount = 0;
    }
  }



  save() {
    if (!this.presupuestoForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.presupuestoForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }
    const data = {
      title: this.presupuestoForm.value.title,
      description: this.presupuestoForm.value.description,
      cliente: this.usuarioSelected,
      usuario: this.user.uid,
      listItems: this.medical,
      amount: this.amount,
      status: 'PENDING',
    }

    if (this.presupuestoSeleccionado) {
      this.presupuestoService.editPresupuesto(data, this.presupuestoSeleccionado._id).subscribe((resp: any) => {
        console.log(data);
        if (resp.message == 403) {
          this.toastr.error('Error Creando Presupuesto', 'Error');

        } else {
          this.toastr.success('Se guardó la informacion del Presupuesto', 'Éxito');
          // Close modal programmatically
          const modalElement = document.getElementById('editPresupuesto');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.reloadList.emit();
          this.ngOnInit()
        }
      })
    } else {
      this.presupuestoService.createPresupuesto(data).subscribe((resp: any) => {
        if (resp.message == 403) {
          this.toastr.error('Error Creando Presupuesto', 'Error');

        } else {
          this.toastr.success('Se guardó la informacion del Presupuesto', 'Éxito');
          // Close modal programmatically
          const modalElement = document.getElementById('editPresupuesto');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.reloadList.emit();
          this.onClose()
        }
      })
    }
  }


}
