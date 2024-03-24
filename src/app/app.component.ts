import { Component, Inject } from '@angular/core';
import { CongeneralService } from './services/congeneral.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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
    private http: HttpClient,
    private _router : Router,
    private meta: Meta,
    private document: Document
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
    // this.document.documentElement.lang = 'es';
  }




}
