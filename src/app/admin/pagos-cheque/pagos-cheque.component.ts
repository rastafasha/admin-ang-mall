import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PagoCheque } from 'src/app/models/pagoCheque.model';
import { PagochequeService } from 'src/app/services/pagocheque.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos-cheque',
  templateUrl: './pagos-cheque.component.html',
  styleUrls: ['./pagos-cheque.component.css']
})
export class PagosChequeComponent implements OnInit {

  pagoscheques: any[] = [];
  pagoscheque: PagoCheque;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'pagoscheques';

  constructor(
    private _pagosChequeService: PagochequeService
  ) { }

  ngOnInit(): void {
    this.obtenerPagosEfectivo();
  }

  private obtenerPagosEfectivo() {
    this._pagosChequeService.listar().subscribe(
      (response: any) => {
        if (response) {
          console.log('pagos en cheque: ', response);
          this.pagoscheques = response;
        }
        else {
          console.log('error al obtener los pagos en cheque')
        }
      }
    );
  }

  cambiarStatus(pago: string) {
    this._pagosChequeService.updateStatus(pago)
      .subscribe(resp => {
        Swal.fire('Actualizado', pago, 'success')
      })

  }

  public PageSize(): void {
    this.query = '';
    this.obtenerPagosEfectivo();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.pagoscheques) {
      this.pagoscheques = event.pagoscheques;
    }
  }

}
