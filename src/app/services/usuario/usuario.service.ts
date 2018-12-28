import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;

  constructor( public http: HttpClient, public router:Router, public _subirArchivo:SubirArchivoService) { 
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

  actualizarUsuario(usuario:Usuario){
    let url = URL_SERVICIOS +'/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
        .pipe(map((resp:any)=>{
          if (usuario._id === this.usuario._id) {
            this.guardarStorage(resp.usuario._id, this.token, resp.usuario)
          }
          swal('Usuario actualizao', `${usuario.nombre}`, 'success')
          return true;
        }))
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

  cambiarImagen(archivo:File, id:string){
    this._subirArchivo.subirArchivo(archivo, 'usuarios', id)
        .then((resp:any)=>{
          this.usuario.img = resp.usuario.img;
          swal('Imagen actualizada', `${this.usuario.nombre}`, 'success')
          this.guardarStorage(id, this.token, this.usuario)
        })
        .catch((resp:any) =>{
          console.log(resp);
          
        })
  }

  cargarUsuarios(desde:number = 0){
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino:string){
    let url  = URL_SERVICIOS + '/busqueda/coleccion/usuario/' + termino;
    return this.http.get(url)
        .pipe(map((resp:any) =>{
          return resp.usuario;
        }))
  }

  borrarUsuario(id:string){
    let url = URL_SERVICIOS +'/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
          .pipe(map(resp =>{
            swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
            return true;
          }))
  }
}
