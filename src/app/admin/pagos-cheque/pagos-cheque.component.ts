import { Component, OnInit } from '@angular/core';
import { PagochequeService } from 'src/app/services/pagocheque.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos-cheque',
  templateUrl: './pagos-cheque.component.html',
  styleUrls: ['./pagos-cheque.component.css']
})
export class PagosChequeComponent implements OnInit {

  pagos_cheques:any[] = [];
  
    constructor(
      private _pagosChequeService: PagochequeService
    ) { }
  
    ngOnInit(): void {
      this.obtenerPagosEfectivo();
    }
  
    private obtenerPagosEfectivo(){
      this._pagosChequeService.listar().subscribe(
        response => {
          if(response.ok){
            console.log('pagos en cheque: ',response.pagos_cheques);
            this.pagos_cheques = response.pagos_cheques;
          }
          else{
            console.log('error al obtener los pagos en cheque')
          }
        }
      );
    }

    cambiarStatus(pago: string){
        this._pagosChequeService.updateStatus(pago)
        .subscribe( resp => {
          Swal.fire('Actualizado', pago,  'success')
        })
    
      }
}
