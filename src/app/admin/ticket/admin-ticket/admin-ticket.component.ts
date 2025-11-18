import { Component, OnInit } from '@angular/core';
import { TicketService } from "src/app/services/ticket.service";
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Location } from '@angular/common';
import { Ticket } from 'src/app/models/ticket.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-ticket',
  templateUrl: './admin-ticket.component.html',
  styleUrls: ['./admin-ticket.component.css']
})
export class AdminTicketComponent implements OnInit {

  public tickets : any = {};
  public page;
  public pageSize = 30;
  public count_cat;
  public identity;

  p: Number = 1;
  count: Number = 8;

  constructor(
    private _ticketService : TicketService,
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private location: Location,
  ) {
    this.identity = this._userService.usuario;
  }

  ngOnInit(): void {
    this.listar();
  }

  listar(){
    this._ticketService.get_tickets_admin().subscribe(
      response =>{
        this.tickets = response;
        this.count_cat = this.tickets.tickets.length;
        this.page = 1;
      },
      error=>{
        console.log(error);
      }
    );
  }

  PageSize(){
    this.listar();
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

   eliminarTicket(item: Ticket){
      this._ticketService.delete(item._id)
      .subscribe( resp => {
        this.listar();
        Swal.fire('Borrado', 'success')
        this.ngOnInit();
      })
  
    }

}
