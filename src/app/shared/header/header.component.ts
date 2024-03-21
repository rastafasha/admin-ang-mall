import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { ContactoService } from 'src/app/services/contact.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { Congeneral } from 'src/app/models/congeneral.model';
import { CongeneralService } from 'src/app/services/congeneral.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;
  public congenerals: Congeneral[];
  public mensajes : Array<any> = [];
  public page:number;
  public pageSize = 15;
  public count_cat:number;

  public activeLang = 'es';
  flag = false;
  is_visible: boolean;

  constructor(
    private usuarioService: UsuarioService,
    private congeralService: CongeneralService,
    private router: Router,
    private _contactoService :ContactoService,
    private translate: TranslateService
  ) {
    this.usuario = usuarioService.usuario;
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {
    this.flag = true;
    this._contactoService.listar().subscribe(
      response=>{
        this.mensajes = response.data;
        this.count_cat = this.mensajes.length;
        this.page = 1;
      },
      error=>{

      }
    );

    this.congeralService.cargarCongenerals().subscribe(
      response=>{
        this.congenerals = response;
        // console.log('header', this.congenerals);
      },
      error=>{

      }
    );
  }

  public cambiarLenguaje(lang:any) {
    this.activeLang = lang;
    this.translate.use(lang);
    this.flag = !this.flag;
    this.is_visible = !this.is_visible;
  }

  logout(){
    this.usuarioService.logout();
  }


  buscar(termino: string){

    if(termino.length === 0){
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);

  }

}
