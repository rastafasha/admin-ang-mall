import { Component, Input } from '@angular/core';
import { TasaDollarbcv } from 'src/app/models/tasadollarbcv';
import { TasadollarbcvService } from 'src/app/services/tasadollarbcv.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasabcv',
  standalone:false,
  templateUrl: './tasabcv.component.html',
  styleUrls: ['./tasabcv.component.css'],
})
export class TasabcvComponent {
  @Input() displaycomponent: string = 'block';
  public tasasbcv!: TasaDollarbcv[];
  error!: string;
  uploadError!: string;
  precio_dia!: number;
  tipoSeleccionado: boolean = false;
  title = 'Tasa de cambio BCV';
  isLoading: boolean = false;

  constructor(
    private tasaBcvService: TasadollarbcvService,
    private accountService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.getTiposdePago();
  }


  getTiposdePago() {
    this.isLoading = true;
    this.tasaBcvService.getTasas().subscribe((resp: any) => {
      this.tasasbcv = resp;
      this.isLoading = false;
    });
  }


  save() {
    const data = {
      precio_dia: this.precio_dia,
    };
    this.tasaBcvService
      .createTasaBcv(data)
      .subscribe((resp: any) => {
        // console.log(resp);
        this.precio_dia;
        // this.tipo ='';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getTiposdePago();
      });
  }

  deleteTipoPago(tiposdepago: any) {
    this.tasaBcvService
      .deleteTasaBcv(tiposdepago.id)
      .subscribe((resp: any) => {
        this.getTiposdePago();
      });
  }
}
