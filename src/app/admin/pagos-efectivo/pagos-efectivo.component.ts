import { Component, OnInit } from '@angular/core';
import { PagoEfectivoService } from 'src/app/services/pago-efectivo.service';

@Component({
  selector: 'app-pagos-efectivo',
  templateUrl: './pagos-efectivo.component.html',
  styleUrls: ['./pagos-efectivo.component.css']
})
export class PagosEfectivoComponent implements OnInit {

  pagos_efectivo:any[] = [];

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
          console.log('pagos en efectivo: ',response.pagos_efectivo);
          this.pagos_efectivo = response.pagos_efectivo;
        }
        else{
          console.log('error al obtener los pagos en efectivo')
        }
      }
    );
  }
}
