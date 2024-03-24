import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-usuarios-tienda',
  templateUrl: './usuarios-tienda.component.html',
  styleUrls: ['./usuarios-tienda.component.css']
})
export class UsuariosTiendaComponent implements OnInit {

  public totalUsuarios: number = 0;
  public tiendausers: Usuario[] = [];
  public tiendausersTemp: Usuario[] = [];

  public desde: number = 0;
  public cargando: boolean = true;

  public imgSubs: Subscription;
  p: number = 1;
  count: number = 8;

  roles: string[] = ['USER', 'MEDICO', 'ADMIN'];

  constructor(
    private usuarioService: UsuarioService,
    private busquedaService: BusquedasService,
    private modalImagenService: ModalImagenService
    ) { }

  ngOnInit(): void {
    this.loadUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadUsuarios();});

  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuariosTienda(this.desde)
    .subscribe(
      ({total, tiendausers})=>{
        this.totalUsuarios = total;
        this.tiendausers = tiendausers;
        this.tiendausersTemp = tiendausers;
        this.cargando = false;
        console.log(this.tiendausers);
      }
    )
  }


  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if( this.desde > this.totalUsuarios){
      this.desde -= valor;
    }

    this.loadUsuarios();


  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.tiendausers = this.tiendausersTemp;
    }

    this.busquedaService.buscar('usuarios', termino)
    .subscribe( (resultados: Usuario[]) => {
      this.tiendausers = resultados;
    })
  }

  eliminarUsuario(usuario: any){

    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No se puede borrarse a si mismo', 'error');

    }

    Swal.fire({
      title: 'Borra usuario?',
      text: `Estar a punto de borrar a ${usuario.first_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.borrarUsuario(usuario).subscribe(
          resp => {
            this.loadUsuarios();
            Swal.fire(
              'Usuario Borrado',
              `El usuario ${usuario.first_name} ha sido borrado correctamente`,
              'success'
               );
          });
      }
    })
  }


  cambiarRole(usuario: Usuario){debugger
    this.usuarioService.guardarUsuario(usuario).subscribe(
      resp =>{ console.log(resp);}
    )
  }


  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);

  }

}
