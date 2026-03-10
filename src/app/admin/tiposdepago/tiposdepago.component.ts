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

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-tiposdepago',
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
  pageTitle: string;

  public slider: any = {};

  tipoSeleccionado: any;
  pagoSeleccionado: any;

  public tiposdepagos: PaymentMethod[] = [];

  bankAccountType: string;
  bankName: string;
  bankAccount: string;
  ciorif: string;
  phone: string;
  email: string;
  tipo: string;
  user: any;
  user_id: string;
  username: string;

  constructor(
    private fb: FormBuilder,
    private paymentMethodService: TiposdepagoService,
    private userService: UsuarioService,
    private location: Location,
    private ativatedRoute: ActivatedRoute,
  ) {
    this.url = environment.baseUrl;
    this.identity = this.userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');

    if (this.user.role === 'SUPERADMIN') {
      this.getTiposdePago();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getTiposdePagoByLocal()
    }
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }


  selectedTypeEdit(tipo: any) {
    this.pagoSeleccionado = tipo;
    // console.log(this.pagoSeleccionado);
  }

  selectedType(tipodepago: any) {
    this.tipoSeleccionado = tipodepago;
    // console.log(this.tipoSeleccionado);
  }

  getTiposdePago() {
    this.paymentMethodService.getPaymentMethods().subscribe(paymentMethods => {
      this.tiposdepagos = paymentMethods;
      // console.log(this.tiposdepagos);
    })
  }
  getTiposdePagoByLocal() {
    this.paymentMethodService.getPaymentMethodByTiendaId(this.user.local).subscribe(paymentMethods => {
     
      this.tiposdepagos = paymentMethods;
      // console.log(this.tiposdepagos);
    })
  }

  cambiarStatus(tipodepago: any) {
    let VALUE = tipodepago.status;
    // console.log(VALUE);

    this.paymentMethodService.updateStatus(tipodepago).subscribe(
      resp => {
        // console.log(resp);
        // Swal.fire('Actualizado', `actualizado correctamente`, 'success');
        // this.toaster.open({
        //   text:'Producto Actualizado!',
        //   caption:'Mensaje de Validación',
        //   type:'success',
        // })
        if (this.user.role === 'SUPERADMIN') {
          this.getTiposdePago();
        }
        if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
          this.getTiposdePagoByLocal()
        }
      }
    )
  }



  save() {

    let data = {
      tipo: this.tipo,
      bankAccountType: this.bankAccountType,
      bankName: this.bankName,
      bankAccount: this.bankAccount,
      ciorif: this.ciorif,
      phone: this.phone,
      username: this.username,
      email: this.email,
      user: this.user.uid,
      local: this.user.local
    }
    this.paymentMethodService.crearPaymentMethod(data).subscribe((resp: any) => {
      // console.log(resp);
      this.tipo = '';
      this.bankAccountType = '';
      this.bankName = '';
      this.bankAccount = '';
      this.ciorif = '';
      this.phone = '';
      this.username = '';
      this.email = '';
      this.pagoSeleccionado = null;
      this.ngOnInit();
    })
  }

  deleteTipoPago(tiposdepago: any) {

    this.paymentMethodService.borrarPaymentMethod(tiposdepago._id).subscribe(
      (resp: any) => {
        if (this.user.role === 'SUPERADMIN') {
          this.getTiposdePago();
        }
        if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
          this.getTiposdePagoByLocal()
        }

      });

  }


}
