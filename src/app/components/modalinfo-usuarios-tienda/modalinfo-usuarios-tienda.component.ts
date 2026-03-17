import { Component, AfterViewInit } from '@angular/core';
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-modalinfo-usuarios-tienda',
  templateUrl: './modalinfo-usuarios-tienda.component.html',
  styleUrls: ['./modalinfo-usuarios-tienda.component.css']
})
export class ModalinfoUsuariosTiendaComponent implements AfterViewInit {

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
