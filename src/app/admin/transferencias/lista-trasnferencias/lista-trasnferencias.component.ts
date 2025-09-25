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

  public trasnferencias: Transferencia[] =[];
  public cargando: boolean = true;

  public desde: number = 0;
  trasnferencia: Transferencia;
  transf: Transferencia;

  p: number = 1;
  count: number = 8;

  query:string ='';
          searchForm!:FormGroup;
          currentPage = 1;
          collecion='categorias';


  constructor(
    private trasnferenciaService: TransferenciaService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {

    this.loadTrasnferencias();
  }


  loadTrasnferencias(){
    this.cargando = true;
    this.trasnferenciaService.getTransferencias().subscribe(
      transferencias => {
        this.cargando = false;
        this.trasnferencias = transferencias;
        console.log(this.trasnferencias);
      }
    )

  }

  cambiarStatus(trasnferencia: Transferencia){
    this.trasnferenciaService.updateStatus(trasnferencia)
    .subscribe( resp => {
      Swal.fire('Actualizado', trasnferencia._id,  'success')
    })

  }

  eliminarSlider(transf: Transferencia){
    this.trasnferenciaService.borrarTransferencia(transf._id)
    .subscribe( resp => {
      this.loadTrasnferencias();
      Swal.fire('Borrado', this.transf.referencia, 'success')
    })

  }

public PageSize(): void {
    this.query = '';
    this.loadTrasnferencias();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.trasnferencias) {
      this.trasnferencias = event.trasnferencias;
    }
  }

}
