import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificatokenGuard implements CanActivate {

  constructor(public _usuarioService:UsuarioService, public router:Router){

  }

  canActivate(): Promise<boolean> | boolean {
    console.log('Inicio de verifica token');
    let token = this._usuarioService.token;
    let payload = JSON.parse(atob(token.split('.')[1]))
    let expirado = this.expirado(payload.exp);
    if (expirado) {
      this.router.navigate(['login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechadeExp:number): Promise<boolean>{
    return new Promise((resolve, reject)=>{
      let tokenExp = new Date(fechadeExp * 1000);
      let ahora =  new Date();
      //                          ( 4 horas, 60 minutos, 60 segundos, 1000 milisegundos)
      ahora.setTime( ahora.getTime() + (1 * 60 * 60 * 1000) );// suma 4 horas
      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true); // si el token no esta proximo a vencer
      }else{//si el token esta proximo a vencer
        this._usuarioService.renuevaToken()
            .subscribe(()=>{
              resolve(true);
            }, ()=>{
              this.router.navigate(['login']);
              reject(false);
            })
      }
      resolve(true);
    })
  }

  expirado(fechadeExp:number){
    let hora = new Date().getTime() / 1000;// esto esta en milisegundo no en segundos por eso se divide por 1000
    if (fechadeExp < hora) {
      return true;
    }else{
      return false;
    }
  }
}
