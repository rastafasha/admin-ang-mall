import { Component, AfterViewInit } from '@angular/core';
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-modalinfo-pago-efectivo',
  standalone:false,
  templateUrl: './modalinfo-pago-efectivo.component.html',
  styleUrls: ['./modalinfo-pago-efectivo.component.css']
})
export class ModalinfoPagoEfectivoComponent implements AfterViewInit {

  isLogued: boolean = false;

   currentStep = 1;

  ngAfterViewInit() {
    const USER = localStorage.getItem("user");
    this.isLogued = !!USER;
    if (localStorage.getItem('modalInicialDismissed')) {
      return;
    }
    setTimeout(() => {
      const modalElement = $('#exampleModal');
      if (modalElement.length) {
        modalElement.modal('show');
      }
    }, 500);
  }

  onNoShowMore() {
    localStorage.setItem('modalInicialDismissed', 'true');
    $('#exampleModal').modal('hide');
  }

}
