import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;

  constructor( public http: HttpClient, public router:Router) { 
    this.cargarStorage();    
  }

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login'])
  }

  loginGoogle(token:string){
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
        .pipe(map((resp:any) =>{
          this.guardarStorage(resp.usuario._id, resp.token, resp.usuario)
          return true;
        }));
  }

  login(usuario:Usuario, recuerdame:boolean= false){
    let url = URL_SERVICIOS + '/login';
    if (recuerdame) {
      localStorage.setItem('email', `${usuario.email}`)
    }else{
      localStorage.removeItem('email')
    }
    return this.http.post(url, usuario)
        .pipe(map((resp:any)=>{
          this.guardarStorage(resp.usuario._id, resp.token, resp.usuario)
          return true;
        }))
  }

  crearUsuario(usuario:Usuario){
    let url = `${URL_SERVICIOS}/usuario`;
    return this.http.post(url,usuario)
        .pipe(map((resp:any) =>{
            swal('Usuario creado!', `${usuario.email}`, 'success')
            return resp.usuario;
        }));
  }

  guardarStorage(id:string, token:string, usuario:Usuario){
    localStorage.setItem('id', id)
    localStorage.setItem('usuario',JSON.stringify(usuario))
    localStorage.setItem('token', token)
    this.usuario = usuario;
    this.token = token;
  }

  cargarStorage(){
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'))
    }else{
      this.token = '';
      this.usuario = null;
    }
  }

  estaLogeado(){
    return (this.token.length > 5) ? true :false;
  }
}