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
  user:any;

   query:string ='';
          searchForm!:FormGroup;
          currentPage = 1;
          collecion='pagoefectivos';

  constructor(
    private _pagosEfectivo: PagoEfectivoService
  ) { }

  ngOnInit(): void {
     window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    
    if (this.user.role === 'SUPERADMIN') {
      this.obtenerPagosEfectivo();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getTiposdePagoByLocal()
    }
  }

  private obtenerPagosEfectivo(){
    this._pagosEfectivo.listar().subscribe(
      (resp:any) => {
        this.pagoefectivos = resp;
        
      }
    );
  }

  getTiposdePagoByLocal() {
    this._pagosEfectivo.getPaymentMethodByTiendaId(this.user.local).subscribe(
      (resp:any) => {
        this.pagoefectivos = resp;
        
      }
    );
  }

  public PageSize(): void {
    this.query = '';
    if (this.user.role === 'SUPERADMIN') {
      this.obtenerPagosEfectivo();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getTiposdePagoByLocal()
    }
  }

  handleSearchEvent(event: any) {
    if (event.pagoefectivos) {
      this.pagoefectivos = event.pagoefectivos;
    }
  }

}
