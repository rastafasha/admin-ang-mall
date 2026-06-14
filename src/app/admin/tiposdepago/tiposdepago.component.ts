import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { SliderService } from 'src/app/services/slider.service';
import { Slider } from 'src/app/models/slider.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TiposdepagoService } from 'src/app/services/tiposdepago.service';
import { PaymentMethod } from 'src/app/models/paymenthmethod.model';
import { Paypal } from 'src/app/models/paypal.model';
import { PaypalService } from 'src/app/services/paypal.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tiposdepago',
  standalone:false,
  templateUrl: './tiposdepago.component.html',
  styleUrls: ['./tiposdepago.component.css']
})
export class TiposdepagoComponent implements OnInit {

  public file: File;
  public imgSelect: String | ArrayBuffer;
  public url;
  public identity;
  public msm_error = false;
  public msm_success = false;
  pageTitle: string = 'Tipos de Pago';

  public slider: any = {};
  paypal: Paypal;
  clientIdPaypal: string = '';
  clientSecret: string = '';
  mode: string = '';

  tipoSeleccionado: any;
  pagoSeleccionado: any;

  public tiposdepagos: PaymentMethod[] = [];

  bankAccountType: string = '';
  bankName: string = '';
  bankAccount: string = '';
  ciorif: string = '';
  phone: string = '';
  email: string = '';
  tipo: string = '';
  user: any;
  user_id: string = '';
  username: string = '';

  // Edit mode properties
  isEditMode: boolean = false;
  editingPayment: PaymentMethod | null = null;
  isLoading = false;

  public info: string = '';
    private langSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private paymentMethodService: TiposdepagoService,
    private userService: UsuarioService,
    private location: Location,
    private paypalService: PaypalService,
    public translate: TranslateService
  ) {
    this.url = environment.baseUrl;
    this.identity = this.userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER || '{}');

    // Load Paypal config first
    if (this.user.local) {
      this.loadPaypalConfig();
    }

    if (this.user.role === 'SUPERADMIN') {
      this.getTiposdePago();
    } else if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getTiposdePagoByLocal();
    }

    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });
  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('PAYMENT_METHODS.TITLE');
    const subtitle = this.translate.instant('PAYMENT_METHODS.SUBTITLE');
    const item1 = this.translate.instant('PAYMENT_METHODS.ITEM_1');
    const item2 = this.translate.instant('PAYMENT_METHODS.ITEM_2');
    const item3 = this.translate.instant('PAYMENT_METHODS.ITEM_3');
    const item4 = this.translate.instant('PAYMENT_METHODS.ITEM_4');
    const item5 = this.translate.instant('PAYMENT_METHODS.ITEM_5');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
      <li>${item3}</li>
      <li>${item4}</li>
      <li>${item5}</li>
    </ul>
  `;
  }

  loadPaypalConfig() {
    this.paypalService.getPaypalByTiendaId(this.user.local).subscribe((paypals: Paypal[]) => {
      if (paypals.length > 0) {
        const pp = paypals[0];
        this.clientIdPaypal = pp.clientIdPaypal || '';
        this.clientSecret = pp.clientSecret || '';
        this.mode = pp.mode || '';
        // Email set by PaymentMethod, not override here
      }
    });
  }

  goBack() {
    this.location.back();
  }

  selectedTypeEdit(tipo: any) {
    this.pagoSeleccionado = tipo;
  }

  selectedType(tipodepago: PaymentMethod) {
    this.tipoSeleccionado = tipodepago;
  }

  editPayment(tipodepago: PaymentMethod) {
    this.editingPayment = { ...tipodepago };
    this.isEditMode = true;
    this.tipoSeleccionado = null;

    // Set main fields
    this.tipo = this.editingPayment!.tipo;
    this.pagoSeleccionado = this.tipo;
    this.bankAccountType = this.editingPayment!.bankAccountType || '';
    this.bankName = this.editingPayment!.bankName || '';
    this.bankAccount = this.editingPayment!.bankAccount?.toString() || '';
    this.ciorif = this.editingPayment!.ciorif || '';
    this.phone = this.editingPayment!.telefono || '';
    this.username = this.editingPayment!.username || '';
    this.email = this.editingPayment!.email || '';

    // Special reload for Paypal fields if editing Paypal
    if (this.tipo === 'paypal') {
      this.loadPaypalConfig();
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingPayment = null;
    this.resetFormFields();
  }

  private resetFormFields() {
    this.tipo = '';
    this.pagoSeleccionado = null;
    this.bankAccountType = '';
    this.bankName = '';
    this.bankAccount = '';
    this.ciorif = '';
    this.phone = '';
    this.username = '';
    this.email = '';
    // Paypal fields untouched (prefilled globally)
  }

  getTiposdePago() {
    this.isLoading = true;
    this.paymentMethodService.getPaymentMethods().subscribe(paymentMethods => {
      this.tiposdepagos = paymentMethods;
      this.isLoading = false;
    });
  }

  getTiposdePagoByLocal() {
    this.isLoading = true;
    this.paymentMethodService.getPaymentMethodByTiendaId(this.user.local).subscribe(paymentMethods => {
      this.tiposdepagos = paymentMethods;
      this.isLoading = false;
    });
  }

  cambiarStatus(tipodepago: PaymentMethod) {
    
    this.paymentMethodService.updateStatus(tipodepago).subscribe(resp => {
      this.reloadList();
    });
  }

  save() {
    if (this.isEditMode && this.editingPayment) {
      // Update PaymentMethod
      this.editingPayment!.tipo = this.tipo;
      this.editingPayment!.bankAccountType = this.bankAccountType;
      this.editingPayment!.bankName = this.bankName;
      this.editingPayment!.bankAccount = parseFloat(this.bankAccount || '0') || 0;
      this.editingPayment!.ciorif = this.ciorif;
      this.editingPayment!.telefono = this.phone;
      this.editingPayment!.username = this.username;
      this.editingPayment!.email = this.email;

      this.paymentMethodService.actualizarPaymentMethod(this.editingPayment!).subscribe((resp: any) => {
        if (this.pagoSeleccionado === 'paypal') {
          this.savePaypalConfig();
        }
        Swal.fire('Éxito', 'Tipo de pago actualizado correctamente', 'success');
        this.cancelEdit();
        this.reloadList();
      }, error => {
        Swal.fire('Error', 'No se pudo actualizar', 'error');
      });
    } else {
      // Create
      let data = {
        tipo: this.tipo,
        bankAccountType: this.bankAccountType,
        bankName: this.bankName,
        bankAccount: parseFloat(this.bankAccount || '0') || 0,
        ciorif: this.ciorif,
        phone: this.phone,
        username: this.username,
        email: this.email,
        user: this.user.uid,
        local: this.user.local
      };
      this.paymentMethodService.crearPaymentMethod(data).subscribe((resp: any) => {
        if (this.pagoSeleccionado === 'paypal') {
          this.savePaypalConfig();
        }
        this.resetFormFields();
        this.reloadList();
      });
    }
  }

  private savePaypalConfig() {
    const data: any = {
      clientIdPaypal: this.clientIdPaypal,
      clientSecret: this.clientSecret,
      mode: this.mode,
      email: this.email,
      local: this.user.local
    };
    this.paypalService.getPaypalByTiendaId(this.user.local).subscribe((paypals: Paypal[]) => {
      if (paypals.length > 0) {
        data._id = paypals[0]._id!;
        this.paypalService.actualizarPaypal(data as Paypal).subscribe(() => {
          console.log('Paypal actualizado correctamente');
        });
      } else {
        this.paypalService.crearPaypal(data).subscribe(() => {
          console.log('Paypal creado correctamente');
        });
      }
    });
  }

  private reloadList() {
    if (this.user.role === 'SUPERADMIN') {
      this.getTiposdePago();
    } else {
      this.getTiposdePagoByLocal();
    }
  }

  deleteTipoPago(tiposdepago: PaymentMethod) {

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
        this.paymentMethodService.borrarPaymentMethod(tiposdepago._id!).subscribe((resp: any) => {
          if (this.user.role === 'SUPERADMIN') {
            this.getTiposdePago();
          } else {
            this.getTiposdePagoByLocal();
          }
        });
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
      }
    });
  }
}

