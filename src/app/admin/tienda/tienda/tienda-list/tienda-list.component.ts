import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, delay } from 'rxjs';
import { Marca } from 'src/app/models/marca.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { TiendaService } from 'src/app/services/tienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tienda-list',
  templateUrl: './tienda-list.component.html',
  styleUrls: ['./tienda-list.component.css']
})
export class TiendaListComponent implements OnInit {

  public tiendas: Tienda;
  public tienda: Tienda;
  public cargando: boolean = true;

  public totalTiendas: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;

  query:string ='';
      searchForm!:FormGroup;
      currentPage = 1;
      collecion='tiendas';
user:Usuario;

  constructor(
    private tiendaService: TiendaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;

    if(this.user.role === 'SUPERADMIN'){
      this.loadTiendas();
    }

    if(this.user.role === 'ADMIN'){
      this.loadTiendasById();
    }

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(banner => { this.loadTiendas();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadTiendas(){
    this.cargando = true;
    this.tiendaService.cargarTiendas().subscribe(
      (resp:any) => {
        this.cargando = false;
        this.tiendas = resp;
        // console.log(this.tiendas);
      }
    )

  }
  loadTiendasById(){
    this.cargando = true;
    this.tiendaService.getTiendasByUserId(this.user.uid).subscribe(
      resp => {
        this.cargando = false;
        this.tiendas = resp;
        console.log(this.tiendas);
      }
    )

  }
  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if( this.desde > this.totalTiendas){
      this.desde -= valor;
    }

    // this.loadTiendas();
    if(this.user.role === 'SUPERADMIN'){
      this.loadTiendas();
    }

    if(this.user.role === 'ADMIN'){
      this.loadTiendasById();
    }


  }

  guardarCambios(tienda: Tienda){
    this.tiendaService.actualizarTienda(tienda)
    .subscribe( (resp:any) => {
      Swal.fire('Actualizado', tienda.nombre,  'success')
    })

  }


  eliminarMarca(tienda: Marca){
    this.tiendaService.borrarTienda(tienda._id)
    .subscribe( (resp:any) => {
      // this.loadTiendas();
      if(this.user.role === 'SUPERADMIN'){
      this.loadTiendas();
    }

    if(this.user.role === 'ADMIN'){
      this.loadTiendasById();
    }
      Swal.fire('Borrado', tienda.nombre, 'success')
    })

  }



  public PageSize(): void {
    this.query = '';
    if(this.user.role === 'SUPERADMIN'){
      this.loadTiendas();
    }

    if(this.user.role === 'ADMIN'){
      this.loadTiendasById();
    }
    // this.loadTiendas();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.tiendas) {
      this.tiendas = event.tiendas;
    }
  }

}
