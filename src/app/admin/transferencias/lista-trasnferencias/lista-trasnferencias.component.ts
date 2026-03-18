import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Slider } from 'src/app/models/slider.model';
import { Transferencia } from 'src/app/models/transferencia';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-trasnferencias',
  templateUrl: './lista-trasnferencias.component.html',
  styleUrls: ['./lista-trasnferencias.component.css']
})
export class ListaTrasnferenciasComponent implements OnInit {

  public transferencias: Transferencia[] = [];
  public cargando: boolean = true;

  public desde: number = 0;
  trasnferencia: Transferencia;
  transf: Transferencia;

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
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    if (this.user.role === 'SUPERADMIN') {
      this.loadTrasnferencias();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.transPorLocalId()
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
    this.trasnferenciaService.updateStatus(trasnferencia)
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

}
