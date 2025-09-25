import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PagoEfectivo } from 'src/app/models/pagoEfectivo.model';
import { PagoEfectivoService } from 'src/app/services/pago-efectivo.service';

@Component({
  selector: 'app-pagos-efectivo',
  templateUrl: './pagos-efectivo.component.html',
  styleUrls: ['./pagos-efectivo.component.css']
})
export class PagosEfectivoComponent implements OnInit {

  pagoefectivos:PagoEfectivo[] = [];
  pagoefectivo:PagoEfectivo;

   query:string ='';
          searchForm!:FormGroup;
          currentPage = 1;
          collecion='pagoefectivos';

  constructor(
    private _pagosEfectivo: PagoEfectivoService
  ) { }

  ngOnInit(): void {
    this.obtenerPagosEfectivo();
  }

  private obtenerPagosEfectivo(){
    this._pagosEfectivo.listar().subscribe(
      response => {
        if(response.ok){
          // console.log('pagos en efectivo: ',response.pagoefectivos);
          this.pagoefectivos = response.pagoefectivos;
        }
        else{
          console.log('error al obtener los pagos en efectivo')
        }
      }
    );
  }

  public PageSize(): void {
    this.query = '';
    this.obtenerPagosEfectivo();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.pagoefectivos) {
      this.pagoefectivos = event.pagoefectivos;
    }
  }

}
