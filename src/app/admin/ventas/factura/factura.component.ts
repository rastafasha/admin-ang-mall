import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { ComentarioService } from 'src/app/services/comentario.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

declare let jsPDF;

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  public identity;
  public detalle : any = {};
  public venta : any = {};
  public url;
  public producto_id:any;

  hab_factura:boolean = false;

  // evento para indicar al componente padre admin-ventas que debe cerrar el modal de 'Enviar Factura'
  @Output() eventCerrarModal = new EventEmitter<string>();

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private activatedRoute :ActivatedRoute,
    private http: HttpClient,
    private _ventaService: VentaService,
    private _comentarioService : ComentarioService,
    private _productoService : ProductoService,
    private cdr: ChangeDetectorRef
  ) {
    this.identity = this._userService.usuario;
    this.url = environment.baseUrl;
   }

  ngOnInit(): void {
    
  }

  cargarFactura(_id:string){
    
    this.producto_id = _id;
    // console.log('id_factura a imprimir: ',this.producto_id)
    this.getDetalle();
    this.url = environment.baseUrl;
  }

  getDetalle(){
    this._ventaService.detalle(this.producto_id).subscribe(
      (response:any) =>{
        // console.log(response);
        this.detalle = response.detalle;
        this.venta = response.venta;
        this.cdr.detectChanges();
        this.hab_factura = true;
      }
    );
  }

  enviarFacturaCliente(){
    var data = document.getElementById('contdiv');

    html2canvas(data,{
      scrollX: 0,
      scrollY: -window.scrollY
  }).then(canvas => {

      var imgWidth = 208;
      var pageHeight = 300;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4');

      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      // pdf.save(this.venta._id+'.pdf');
      // console.log('user email cliente: ',this.venta.user.email)

      // llamo al servicio para enviar la factura al cliente
      this._ventaService.enviarFacturaCliente(pdf,this.venta).subscribe(
        response => {

          if(response.ok){
            // llamo al evento de cerrar modal en el componente padre
            this.cerrarModal('exito');
            // correo enviado con exito
            console.log(response.message);
            Swal.fire({
              title: 'Éxito',
              text: response.message,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
          }
          else{
            // llamo al evento de cerrar modal en el componente padre
            this.cerrarModal('error');
            // error al enviar el correo
            console.log(response.message);
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
          
        }
      );

      this.hab_factura = false;
      this.producto_id = '';
      this.venta = {};

    });
  }

  cerrarModal(valor:string){
    this.eventCerrarModal.emit(valor);
  }

}
