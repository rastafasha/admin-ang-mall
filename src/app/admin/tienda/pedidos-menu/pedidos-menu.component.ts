import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido.model';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { PedidomenuService } from 'src/app/services/pedidomenu.service';
import { WhatsappService } from 'src/app/services/whatsapp.service';
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-pedidos-menu',
  standalone: false,
  templateUrl: './pedidos-menu.component.html',
  styleUrls: ['./pedidos-menu.component.css']
})
export class PedidosMenuComponent implements OnInit, OnDestroy {
  public pedidos: Pedido[];
  public status: string = 'PENDING';
  public cargando: boolean = false;

  // public pageSize = 10;
  public count_cat;
  p: number = 1;
  count: number = 5;
  user: any;
  role: any;
  local: any;
  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;
  public info: string = '';
  private langSubscription!: Subscription;

  constructor(
    private pedidosMenuService: PedidomenuService,
    private translate: TranslateService,
    private whatsappService: WhatsappService,
  ) { }

  ngOnInit(): void {
    // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.role = this.user.role
    this.local = this.user.local

    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('ORDERS.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    setTimeout(() => {
      if (this.role === 'SUPERADMIN') {
        this.getPedidos();
      }
      if (this.role === 'ADMIN') {
        this.pedidosPorLocalId()
      }
    }, 1000)


  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('ORDERS.TITLE');
    const subtitle = this.translate.instant('ORDERS.SUBTITLE');
    const item1 = this.translate.instant('ORDERS.ITEM_1');
    const item2 = this.translate.instant('ORDERS.ITEM_2');
    const item3 = this.translate.instant('ORDERS.ITEM_3');
    const item4 = this.translate.instant('ORDERS.ITEM_4');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
      <li>${item3}</li>
      <li>${item4}</li>
    </ul>
  `;
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      if (this.role === 'SUPERADMIN') {
        this.getPedidos();
      }
      if (this.role === 'ADMIN') {
        this.pedidosPorLocalId()
      }
    }
    if (this.option_selectedd === 2) {
      if (this.role === 'SUPERADMIN') {
        this.getPedidos();
      }
      if (this.role === 'ADMIN') {
        this.pedidosPorLocalId()
      }
    }
  }

  PageSize() {
    this.ngOnInit()
  }
  getPedidos() {
    this.cargando = true;
    this.pedidosMenuService.getByStatus(this.status).subscribe((resp) => {
      this.pedidos = resp;
      this.cargando = false;
    })
  }
  pedidosPorLocalId() {
    this.cargando = true;
    this.pedidosMenuService.getByTiendaId(this.local).subscribe((resp: any) => {
      this.pedidos = resp;
      console.log(resp)
      this.user = resp.user
      this.cargando = false;
    })
  }

  activar(id) {
    this.cargando = true;
    this.pedidosMenuService.activar(id).subscribe(
      response => {
        // Opcional: Podrías mandar un WhatsApp diciendo "Tu pedido empezó a prepararse"
        this.ngOnInit()
      }
    )
  }
  /**
   * PEDIDO LISTO PARA RETIRAR (Equivale a tu lógica de desactivar/pausar de la cola de cocina)
   */
  desactivar(id) {
    console.log(id);
    this.cargando = true;

    // 1. Buscamos el pedido en el array para obtener el teléfono y el número identificador
    const pedidoActivo = this.pedidos.find(p => p._id === id);

    this.pedidosMenuService.desactivar(id).subscribe(
      response => {
        if (pedidoActivo && pedidoActivo.user.telefono) {
          // 2. Disparamos la plantilla "LISTO" enviando las propiedades requeridas
          this.whatsappService.notificarCambioEstadoPedido(
            this.local,
            pedidoActivo.user.telefono,
            'LISTO',
            pedidoActivo.nroPedido || id.substring(0, 5) // Fallback si no maneja número correlativo largo
          ).subscribe({
            next: () => console.log(`🔔 Cliente notificado: Listo para retirar.`),
            error: (err) => console.error(`❌ Error en notificación WA:`, err)
          });
        }
        this.ngOnInit();
      }
    );
  }
  finalizar(id) {
    this.cargando = true;

    // 1. Buscamos el pedido en memoria antes de que se limpie la tabla
    const pedidoActivo = this.pedidos.find(p => p._id === id);

    this.pedidosMenuService.finalizado(id).subscribe(
      response => {
        if (pedidoActivo && pedidoActivo.user.telefono) {
          // 2. Disparamos la plantilla "DESPACHADO" (Va en camino por delivery)
          this.whatsappService.notificarCambioEstadoPedido(
            this.local,
            pedidoActivo.user.telefono,
            'DESPACHADO',
            pedidoActivo.nroPedido || id.substring(0, 5)
          ).subscribe({
            next: () => console.log(`🔔 Cliente notificado: Pedido en camino.`),
            error: (err) => console.error(`❌ Error en notificación WA:`, err)
          });
        }
        this.ngOnInit();
      }
    );
  }

  eliminarPedido(pedido) {

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
        this.pedidosMenuService.borrarPedido(pedido._id).subscribe(
          response => {
            if (this.role === 'SUPERADMIN') {
              this.cargando = false;
              this.getPedidos();
            }
            if (this.role === 'ADMIN') {
              this.cargando = false;
              this.pedidosPorLocalId()
            }
          }
        )
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
        this.ngOnInit();
      }
    });




  }



}
