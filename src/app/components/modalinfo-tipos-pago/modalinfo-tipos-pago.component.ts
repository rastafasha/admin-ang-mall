import { Component, AfterViewInit } from '@angular/core';
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-modalinfo-tipos-pago',
  templateUrl: './modalinfo-tipos-pago.component.html',
  styleUrls: ['./modalinfo-tipos-pago.component.css']
})
export class ModalinfoTiposPagoComponent implements AfterViewInit {

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
