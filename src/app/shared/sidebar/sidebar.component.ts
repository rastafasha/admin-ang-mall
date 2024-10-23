import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {


  public usuario: Usuario;
  user:any;

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService
  ) {

    this.usuario = usuarioService.usuario;

  }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');
  }

  logout(){
    this.usuarioService.logout();
  }

}
