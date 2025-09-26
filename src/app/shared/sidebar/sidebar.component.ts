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
  role:any;

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService
  ) {

    // this.usuario = usuarioService.usuario;

  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.usuario = JSON.parse(user);
    this.role = this.usuario.role;
  }

  logout(){
    this.usuarioService.logout();
  }

}
