import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import {environment} from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TicketService } from "src/app/services/ticket.service";
import * as io from "socket.io-client";
import { Location } from '@angular/common';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements OnInit {

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;
  urlSocket = environment.soketServer;

  public identity: any = {};
  public url;
  public id;
  public msm = '';
  public usuario : any = {};
  public usuariodetail : any = {};
  public msm_error=false;
  public mensajes : Array<any> = [];
  public poster_admin;
  public ticket : any = {};
  public socket = io(this.urlSocket);
  public close_ticket = false;
  public estado_ticket;

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private http: HttpClient,
    private _ticketService : TicketService,
    private location: Location,
  ) {
    // this.identity = this._userService.usuario;
     let USER = localStorage.getItem('user');
    if(USER){
      this.identity = JSON.parse(USER);
    }
  }

  ngOnInit(): void {

    this.url = environment.baseUrl;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];

      }
    );
    this.socket.on('new-mensaje', function (data) {
      this.mensajes = [];
      this._ticketService.get_ticket(this.id).subscribe(
        response =>{

          this.ticket = response.ticket;
          this.estado_ticket = this.ticket.estado;
          this._userService.getUserById(this.ticket.user).subscribe(
            response =>{
              this.usuario = response._id;
              this.poster_admin = response.img;
              console.log(response)

              this.listar();
            },
            error=>{
              console.log(error);

            }
          );
        },
        error=>{
        }
      );

    }.bind(this));

    this._ticketService.get_ticket(this.id).subscribe(
      response =>{
        this.ticket = response.ticket;
        this.usuario = this.ticket.user
        this.estado_ticket = this.ticket.estado;
        console.log(response)

        this._userService.getUserById( this.usuario).subscribe(
          response =>{
            this.usuariodetail = response;
            this.poster_admin = response.img;

            this.listar();
          },
          error=>{
            console.log(error);

          }
        );
      },
      error=>{
      }
    );



  }

  listar(){
    this._ticketService.get_ticketmensajes(this.id).subscribe(
      response=>{
        console.log(response)
        if (response.mensajes && Array.isArray(response.mensajes)) {
            response.mensajes.forEach(element => {
                if(element.ticket == this.id){
                    this.mensajes.push(element);
                }
            });
               
        }
        this.scrollToBottom();


      },
      error=>{


      }
    );
  }
  // listar(){
  //   this._ticketService.data(this.identity.uid,this.usuario).subscribe(
  //     response=>{
  //       console.log(response)
  //       if (response.mensajes && Array.isArray(response.mensajes)) {
  //           response.mensajes.forEach(element => {
  //               if(element.ticket == this.id){
  //                   this.mensajes.push(element);
  //               }
  //           });
               
  //       }
  //       this.scrollToBottom();


  //     },
  //     error=>{


  //     }
  //   );
  // }


  sendMessage(msmForm){
    if(msmForm.valid){

      if(this.close_ticket){
        //  enviar y cerrar ticket
        let data={
          de:this.identity.uid,
          para:this.usuario,
          msm:msmForm.value.msm,
          ticket:this.id,
          status: 1,
          estado: 0
        }
        this._ticketService.send(data).subscribe(
          response =>{
            console.log(response);
            this.msm = '';
            this.socket.emit('save-mensaje', {new:true});
            this.scrollToBottom();
            this.socket.emit('save-formmsm', {data:true});
          },
          error=>{
            console.log(error);

          }
        );
      }
      else{
        let data={
          de:this.identity.uid,
          para:this.usuario,
          msm:msmForm.value.msm,
          ticket:this.id,
          status: 1,
          estado: null
        }
        this._ticketService.send(data).subscribe(
          response =>{
            console.log(response);
            this.msm = '';
            this.socket.emit('save-mensaje', {new:true});
            this.scrollToBottom();
          },
          error=>{
            console.log(error);

          }
        );
      }
    }else{
      this.msm_error =true;
    }
  }


  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
