import { Component, AfterViewInit } from '@angular/core';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-modal-inicial',
  standalone:false,
  templateUrl: './modal-inicial.component.html',
  styleUrls: ['./modal-inicial.component.css']
})
export class ModalInicialComponent implements AfterViewInit {
  
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

  nextStep() {
    this.currentStep = 2;

  }

  prevStep() {
    this.currentStep = 1;
  }
 
}
