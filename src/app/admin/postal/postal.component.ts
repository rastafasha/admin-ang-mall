import { Component, OnInit } from '@angular/core';
import { Postal } from "src/app/models/postal.model";
import { PostalService } from "src/app/services/postal.service";
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-postal',
  standalone: false,
  templateUrl: './postal.component.html',
  styleUrls: ['./postal.component.css']
})
export class PostalComponent implements OnInit {

  public postal:Postal;
  public msm_error = '';
  public postales;
  public identity;
  option_selectedd: number = 1;
  solicitud_selectedd: any = null;
  cargando = false;
  crearNuevo = false;

  postalSeleccionado: any;

  public info: string = '';
  private langSubscription!: Subscription;

  constructor(
    private postalService: PostalService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.identity = USER ? JSON.parse(USER) : null;
    this.crearNuevo = false;
    this.listar();
    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('DELIVERY.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });
  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('DELIVERY.TITLE');
    const subtitle = this.translate.instant('DELIVERY.SUBTITLE');
    const item1 = this.translate.instant('DELIVERY.ITEM_1');
    const item2 = this.translate.instant('DELIVERY.ITEM_2');
    const item3 = this.translate.instant('DELIVERY.ITEM_3');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
      <li>${item3}</li>
    </ul>
  `;
  }



  
  listar() {
    this.postalService.getPostalesLocal(this.identity.local).subscribe(
      (resp:any) => {
        this.postales = resp;
      },
      error => {
      }
    );
  }

  close_alert() {
    this.msm_error = '';
  }

  eliminar(id) {
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
        this.cargando = true;
        this.postalService.eliminar(id)
          .subscribe(resp => {
            this.listar();
          })
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
      }
    });
  }

  



  onEditProject(postal: Postal) {
      this.postalSeleccionado = postal;
    }
  
    openEditModal(): void {
      this.postalSeleccionado = null;
    }
  
    onCloseModal(): void {
      this.postalSeleccionado = null;
    }
  
    onClose() {
      this.ngOnInit();
    }
}
