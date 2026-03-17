import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-modalinfo-tiendas',
  templateUrl: './modalinfo-tiendas.component.html',
  styleUrls: ['./modalinfo-tiendas.component.css']
})
export class ModalinfoTiendasComponent  implements AfterViewInit {

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
