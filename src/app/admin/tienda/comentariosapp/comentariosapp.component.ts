import { Component, OnInit } from '@angular/core';
import { ComentarioApp } from 'src/app/models/comentarioapp.model';
import { ComentarioappService } from 'src/app/services/comentarioapp.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentariosapp',
  standalone:false,
  templateUrl: './comentariosapp.component.html',
  styleUrls: ['./comentariosapp.component.css']
})
export class ComentariosappComponent implements OnInit {

  public comentarios: ComentarioApp[];
    public status: string = 'PENDING';
    public cargando: boolean = false;
  
    public pageSize = 10;
    public count_cat;
    p: number = 1;
    count: number = 8;
    user: any;
  
    constructor(
      private comentariosappService: ComentarioappService
    ) { }
  
    ngOnInit(): void {
      // obtengo el usuario
      let USER = localStorage.getItem("user");
      this.user = JSON.parse(USER ? USER : '');
  
      if (this.user.role === 'SUPERADMIN') {
        this.getComentariosApp();
      }
      if (this.user.role === 'ADMIN') {
        this.comentariosappPorLocalId()
      }
    }
  
    getComentariosApp() {
      this.cargando = true;
      this.comentariosappService.getAll().subscribe((resp) => {
        this.comentarios = resp;
        this.cargando = false;
      })
    }
    comentariosappPorLocalId() {
      this.cargando = true;
      this.comentariosappService.getByTiendaId(this.user.local).subscribe((resp: any) => {
        this.comentarios = resp;
        console.log(this.comentarios)
        this.cargando = false;
      })
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
          this.comentariosappService.borrar(pedido._id).subscribe(
            response => {
              if (this.user.role === 'SUPERADMIN') {
                this.cargando = false;
                this.getComentariosApp();
              }
              if (this.user.role === 'ADMIN') {
                this.cargando = false;
                this.comentariosappPorLocalId()
              }
            }
          )
          Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
          this.ngOnInit();
        }
      });
  
  
  
  
    }
  
    PageSize() {
      if (this.user.role === 'SUPERADMIN') {
        this.getComentariosApp();
      }
      if (this.user.role === 'ADMIN') {
        this.comentariosappPorLocalId()
      }
    }

}
