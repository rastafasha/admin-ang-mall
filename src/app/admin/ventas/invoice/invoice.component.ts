import { Component, OnInit } from '@angular/core';
declare let jsPDF;
import html2canvas from 'html2canvas';
import { UsuarioService } from '../../../services/usuario.service';
import {environment} from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VentaService } from "src/app/services/venta.service";
import { ComentarioService } from "src/app/services/comentario.service";
import { ProductoService } from 'src/app/services/producto.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { Tienda } from 'src/app/models/tienda.model';

@Component({
  selector: 'app-invoice',
  standalone:false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  public identity;
  public id;
  public detalle : any = {};
  public venta : any = {};
  public url;
  public producto_id:any;
  public tienda:Tienda;
  public tienda_moneda:string;
  public local:string;

  constructor(
    private _userService: UsuarioService,
    private _router : Router,
    private activatedRoute :ActivatedRoute,
    private http: HttpClient,
    private _ventaService: VentaService,
    private _comentarioService : ComentarioService,
    private _productoService : ProductoService,
    private tiendaService : TiendaService,
  ) {
    this.identity = this._userService.usuario;
    this.url = environment.baseUrl;
   }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.activatedRoute.params.subscribe((resp:any)=>{
      this.producto_id = resp.id;
    })
    this.getDetalle();
    this.url = environment.baseUrl;
    
  }

  getDetalle(){
    this._ventaService.detalle(this.producto_id).subscribe(
      (response:any) =>{
        this.detalle = response.detalle;
        this.venta = response.venta;
        this.local= response.venta.local;
        this.getTiendaId()

      },
      error=>{
      }
    );
  }

  getTiendaId(){
    this.tiendaService.getTiendaById(this.local).subscribe((resp:any)=>{
      this.tienda = resp;
      this.tienda_moneda = this.tienda.moneda
    })
  }



  imprimir(){
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
      pdf.save(this.venta._id+'.pdf');
    });
  }
}
