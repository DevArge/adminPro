import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(public _usuarioService:UsuarioService, public route:Router){}

  canActivate() {
    if (this._usuarioService.estaLogeado()) {
      console.log('paso x el login guard');
      return true;
    }else{
      console.log('bloqueado por el guard');
      this.route.navigate(['/login'])
      return false;
    }    
  }
}