import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-pago',
  templateUrl: './modal-pago.component.html',
  styleUrls: ['./modal-pago.component.css']
})
export class ModalPagoComponent implements OnInit {

  @Input() amount: any;
  @Input() items: any;


  constructor(
    public activeModal:NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
