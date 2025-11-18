import { Component, OnInit, DoCheck } from '@angular/core';
import {environment} from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { SettingsService } from '../../services/settings.service';
import { CongeneralService } from 'src/app/services/congeneral.service';
import { Congeneral } from 'src/app/models/congeneral.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css'],
})
export class AccountSettingComponent implements OnInit {

  // public linktTheme = document.querySelector('#theme');// se comunica el id pulsado
  // public links: NodeListOf<Element>; //obtiene clase del div

  public usuario: Usuario;

  public congenerals: Congeneral[] =[];

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private settingsService: SettingsService,
    private congeneralService: CongeneralService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public sanitizer: DomSanitizer
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    //this.links = document.querySelectorAll('.selector');//obtiene clase del div // se dispara despues de inicializado el componente
    this.settingsService.checkCurrentTheme(); //llamamos la funccion desde el servicio

    this.loadCongenerals();
    

  }

  loadCongenerals(){
    this.congeneralService.cargarCongenerals().subscribe(
      congenerals => {
        this.congenerals = congenerals;
        console.log(this.congenerals);
      }
    )

  }


  changeTheme(theme:string){ //recibe la data del boton por medio de la clase theme:string

    this.settingsService.changeTheme(theme);// llamamos el servicio
  }

  /*checkCurrentTheme(){ //funcion para llamar desde un elemento html, class, div, id, svg!!
    this.links.forEach(elem => {

      elem.classList.remove('working'); //elimina la clase a cambiar
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl= `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linktTheme.getAttribute('href');

      if(btnTheme === currentTheme){
        elem.classList.add('working');
      }

    })


  }*/

  getMapIframe(url) {
    var mapa, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    mapa   = (results === null) ? url : results[1];

    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed?' + mapa);
}


onDarkMode(dark:string){
    var element = document.body;

    const classExists = document.getElementsByClassName(
      'darkmode'
     ).length > 0;

    var dayNight = document.getElementsByClassName("site");
      for (var i = 0; i<dayNight.length; i++) {
        // dayNight[i].classList.toggle("darkmode");
        element.classList.toggle("darkmode");

      }
      // localStorage.setItem('dark', dark);

      if (classExists) {
        localStorage.removeItem('darkmode');
        // console.log('✅ class exists on page, removido');
      } else {
        localStorage.setItem('darkmode', dark);
        // console.log('⛔️ class does NOT exist on page, agregado');
      }
      // console.log('Pulsado');
  }


}
