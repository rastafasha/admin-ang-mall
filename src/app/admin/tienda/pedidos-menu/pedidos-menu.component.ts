import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido.model';
import { PedidomenuService } from 'src/app/services/pedidomenu.service';

declare var $:any;
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

  constructor(
    private pedidosMenuService: PedidomenuService
  ) { }

  ngOnInit(): void {
    this.getPedidos();
  }

  getPedidos() {
    this.cargando = true;
    this.pedidosMenuService.getByStatus(this.status).subscribe((resp) => {
      this.pedidos = resp;
      this.cargando = false;
    })
  }

   activar(id){
    this.pedidosMenuService.activar(id).subscribe(
      response=>{
        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.getPedidos();
      }
    )
  }

   eliminarPedido(pedido){
    this.pedidosMenuService.borrarPedido(pedido._id).subscribe(
      response=>{
        this.getPedidos();
      }
    )
  }

  PageSize(){
    this.getPedidos();
  }

}
