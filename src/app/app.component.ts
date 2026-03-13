import { Component } from '@angular/core';
import { CongeneralService } from './services/congeneral.service';
import { PaypalService } from './services/paypal.service';
import { UsuarioService } from './services/usuario.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';
  public congenerals : any = {};
  public url: any;
  public headers = false;

  constructor(
    private _congeneralService : CongeneralService,
    private paypalService: PaypalService,
    private usuarioService: UsuarioService,
    private _router : Router,
    private meta: Meta
    ){
      this._congeneralService.cargarCongenerals().subscribe( response =>{
        this.congenerals = response; this.url = environment.baseUrl;
        $('#favicon_icon').attr('href',this.url+'/congenerals/'+this.congenerals[0].favicon);
        $('#title_general').text(this.congenerals[0].titulo);
        console.log(this.congenerals);
        console.log(this.congenerals[0].titulo);
      },
         error=>{ } );
        this._congeneralService.cargarCongenerals().subscribe( response =>{
          this.congenerals = response; this.url = environment.baseUrl;
          $('#favicon_icon').attr('href',this.url+'/congenerals/'+this.congenerals[0].favicon);
          $('#title_general').text(this.congenerals[0].titulo);
        }, error=>{ } );

        const keywords: string[] = ['foo', 'bar', 'poo']
    this.meta.addTag({ name: 'keywords', content: keywords.join(',') });
  }

  ngOnInit(): void{
    window.scroll(0,0);
    
    // Load dynamic PayPal SDK if user logged in
    if (this.usuarioService.usuario?.local) {
      const tiendaId = typeof this.usuarioService.usuario.local === 'string' 
        ? this.usuarioService.usuario.local 
        : (this.usuarioService.usuario.local as any)._id;
      this.paypalService.loadGlobalPaypalSDK(tiendaId).subscribe({
        next: (paypal) => console.log('Dynamic PayPal loaded:', paypal),
        error: (err) => console.error('PayPal load failed:', err)
      });
    }
  }




}
