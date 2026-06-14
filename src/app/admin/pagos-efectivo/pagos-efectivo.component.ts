import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PagoEfectivo } from 'src/app/models/pagoEfectivo.model';
import { PagoEfectivoService } from 'src/app/services/pago-efectivo.service';

@Component({
  selector: 'app-pagos-efectivo',
  standalone: false,
  templateUrl: './pagos-efectivo.component.html',
  styleUrls: ['./pagos-efectivo.component.css']
})
export class PagosEfectivoComponent implements OnInit {

  pagoefectivos: PagoEfectivo[] = [];
  pagoefectivo: PagoEfectivo;
  user: any;
  cargando = false;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'pagoefectivos';
  public info: string = '';
  private langSubscription!: Subscription;

  constructor(
    private _pagosEfectivo: PagoEfectivoService,
    private translate: TranslateService
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
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });
  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('CASH_PAYMENT.TITLE');
    const subtitle = this.translate.instant('CASH_PAYMENT.SUBTITLE');
    const item1 = this.translate.instant('CASH_PAYMENT.ITEM_1');
    const item2 = this.translate.instant('CASH_PAYMENT.ITEM_2');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
    </ul>
  `;
  }

  private obtenerPagosEfectivo() {
    this.cargando = true;
    this._pagosEfectivo.listar().subscribe(
      (resp: any) => {
        this.pagoefectivos = resp;
        this.cargando = false;
      }
    );
  }

  getTiposdePagoByLocal() {
    this.cargando = true;
    this._pagosEfectivo.getPaymentMethodByTiendaId(this.user.local).subscribe(
      (resp: any) => {
        this.pagoefectivos = resp;
        this.cargando = false;
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
