import { Component, Input } from '@angular/core';
import { TasaEurobcv } from 'src/app/models/tasaeurobcv';
import { TasaeurobcvService } from 'src/app/services/tasaeurobcv.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasaeurobcv',
  standalone:false,
  templateUrl: './tasaeurobcv.component.html',
  styleUrls: ['./tasaeurobcv.component.css'],
})
export class TasaeurobcvComponent {
  @Input() displaycomponent: string = 'block';
  public tasasbcv!: TasaEurobcv[];
  error!: string;
  uploadError!: string;
  precio_dia!: number;
  tipoSeleccionado: boolean = false;
  title = 'Tasa de cambio BCV';
  isLoading: boolean = false;

  constructor(
    private tasaBcvService: TasaeurobcvService,
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
