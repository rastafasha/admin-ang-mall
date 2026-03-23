import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Slider } from 'src/app/models/slider.model';
import { Transferencia } from 'src/app/models/transferencia';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-trasnferencias',
  standalone:false,
  templateUrl: './lista-trasnferencias.component.html',
  styleUrls: ['./lista-trasnferencias.component.css']
})
export class ListaTrasnferenciasComponent implements OnInit {

  public transferencias: Transferencia[] = [];
  public cargando: boolean = true;

  public desde: number = 0;
  trasnferencia: Transferencia;
  transf: Transferencia;
  tienda_moneda:string;

  p: number = 1;
  count: number = 8;
  user: any;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'categorias';


  constructor(
    private trasnferenciaService: TransferenciaService,
    private busquedaService: BusquedasService,
    private tiendaService: TiendaService,
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    if (this.user.role === 'SUPERADMIN') {
      this.loadTrasnferencias();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.transPorLocalId()
      this.getTienda();
    }
  }


  loadTrasnferencias() {
    this.cargando = true;
    this.trasnferenciaService.getTransferencias().subscribe(
      transferencias => {
        this.cargando = false;
        this.transferencias = transferencias;
      }
    )

  }

  getTienda(){
    this.tiendaService.getTiendaById(this.user.local).subscribe((resp:any)=>{
      this.tienda_moneda = resp.moneda;
    })
  }

  transPorLocalId() {
    this.cargando = true;
    this.trasnferenciaService.getTransferenciaByTiendaId(this.user.local).subscribe(
      (resp: any) => {
        this.transferencias = resp;
        this.cargando = false;
      }
    )
  }

  cambiarStatus(trasnferencia: Transferencia) {
    const data ={
      ...trasnferencia,
      local: this.user.local,
      updatedAt: Date.now
    }

    this.trasnferenciaService.updateStatus(data)
      .subscribe(resp => {
        Swal.fire('Actualizado', trasnferencia._id, 'success')
      })

  }

  eliminarTramsf(transf: Transferencia) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No podras recuperarlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.trasnferenciaService.borrarTransferencia(transf._id)
          .subscribe(resp => {
            if (this.user.role === 'SUPERADMIN') {
              this.loadTrasnferencias();
            }
            if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
              this.transPorLocalId()
            }
          })
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
      }
    });

  }

  public PageSize(): void {
    this.query = '';
    if (this.user.role === 'SUPERADMIN') {
      this.loadTrasnferencias();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.transPorLocalId()
    }
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.trasnferencias) {
      this.transferencias = event.trasnferencias;
    }
  }

  getCurrencySymbol(tipo: string): string {
    switch (tipo) {
      case 'Transferencia Euro': return '€';
      case 'Transferencia Dólares': return '$';
      case 'Transferencia Bolivares': return 'Bs.';
      default: return '$';
    }
  }

}
