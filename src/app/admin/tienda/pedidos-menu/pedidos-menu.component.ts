import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido.model';
import { PedidomenuService } from 'src/app/services/pedidomenu.service';

declare var $: any;
@Component({
  selector: 'app-pedidos-menu',
  templateUrl: './pedidos-menu.component.html',
  styleUrls: ['./pedidos-menu.component.css']
})
export class PedidosMenuComponent implements OnInit {
  public pedidos: Pedido[];
  public status: string = 'PENDING';
  public cargando: boolean = false;

  public pageSize = 10;
  public count_cat;
  p: number = 1;
  count: number = 8;
  user: any;

  constructor(
    private pedidosMenuService: PedidomenuService
  ) { }

  ngOnInit(): void {
    // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');

    if (this.user.role === 'SUPERADMIN') {
      this.getPedidos();
    }
    if (this.user.role === 'ADMIN') {
      this.pedidosPorLocalId()
    }
  }

  getPedidos() {
    this.cargando = true;
    this.pedidosMenuService.getByStatus(this.status).subscribe((resp) => {
      this.pedidos = resp;
      console.log('Pedidos loaded (getByStatus):', this.pedidos);
      this.cargando = false;
    })
  }
  pedidosPorLocalId() {
    this.cargando = true;
    this.pedidosMenuService.getByTiendaId(this.user.local).subscribe((resp: any) => {
      this.pedidos = resp;
      console.log('Pedidos loaded (getByTiendaId):', this.pedidos);
      this.user = resp.user
      this.cargando = false;
    })
  }

  activar(id) {
    this.pedidosMenuService.activar(id).subscribe(
      response => {
        $('#activar-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        if (this.user.role === 'SUPERADMIN') {
          this.getPedidos();
        }
        if (this.user.role === 'ADMIN') {
          this.pedidosPorLocalId()
        }
      }
    )
  }

  eliminarPedido(pedido) {
    this.pedidosMenuService.borrarPedido(pedido._id).subscribe(
      response => {
        if (this.user.role === 'SUPERADMIN') {
          this.getPedidos();
        }
        if (this.user.role === 'ADMIN') {
          this.pedidosPorLocalId()
        }
      }
    )
  }

  PageSize() {
    if (this.user.role === 'SUPERADMIN') {
      this.getPedidos();
    }
    if (this.user.role === 'ADMIN') {
      this.pedidosPorLocalId()
    }
  }

}
