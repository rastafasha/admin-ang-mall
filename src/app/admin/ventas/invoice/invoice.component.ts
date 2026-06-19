import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { UsuarioService } from '../../../services/usuario.service';
import {environment} from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { VentaService } from "src/app/services/venta.service";
import { TiendaService } from 'src/app/services/tienda.service';
import { Tienda } from 'src/app/models/tienda.model';
import { TranslateService } from '@ngx-translate/core';

declare let jsPDF;
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
  isLoading =false;

  constructor(
    private _userService: UsuarioService,
    private activatedRoute :ActivatedRoute,
    private _ventaService: VentaService,
    private tiendaService : TiendaService,
    public translate: TranslateService 
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
    this.isLoading =true;
    this._ventaService.detalle(this.producto_id).subscribe(
      (response:any) =>{
        this.detalle = response.detalle;
        this.venta = response.venta;
        this.local= response.venta.local;
        this.isLoading =false;
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
