import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/services.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  
  usuario:Usuario;

  constructor(public _usuarioService:UsuarioService, public route:Router) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  buscar(termino:string){
    this.route.navigate(['/busqueda', termino]);
  }

}
