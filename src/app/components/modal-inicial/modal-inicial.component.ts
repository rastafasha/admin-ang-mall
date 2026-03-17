import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-modal-inicial',
  templateUrl: './modal-inicial.component.html',
  styleUrls: ['./modal-inicial.component.css']
})
export class ModalInicialComponent implements AfterViewInit {
  
  isLogued: boolean = false;

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
