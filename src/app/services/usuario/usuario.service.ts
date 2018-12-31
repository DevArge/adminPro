import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;
  menu:any[] = [];

  constructor( public http: HttpClient, public router:Router, public _subirArchivo:SubirArchivoService) { 
    this.cargarStorage();    
  }

  renuevaToken(){
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;
    return this.http.get(url)
        .pipe(
          map((resp:any)=>{
            this.token = resp.token;
            localStorage.setItem('token', this.token)  
            return true;
          }),
          catchError(err =>{
            this.router.navigate(['login'])
            swal('No se pudo renovar token','No es posible renovar token', 'error')
            return throwError(err)
          })
        );
  }

  logout(){
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login'])
  }

  loginGoogle(token:string){
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
        .pipe(map((resp:any) =>{
          this.guardarStorage(resp.usuario._id, resp.token, resp.usuario, resp.menu)
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
        .pipe(
          map((resp:any)=>{
            this.guardarStorage(resp.usuario._id, resp.token, resp.usuario, resp.menu)
            return true;
          }),
          catchError(err =>{
            console.log(err.error.mensaje);
            swal('Error en el login', err.error.mensaje, 'error')
            return throwError(err)
          })
        );
  }

  crearUsuario(usuario:Usuario){
    let url = `${URL_SERVICIOS}/usuario`;
    return this.http.post(url,usuario)
        .pipe(
          map((resp:any) =>{
              swal('Usuario creado!', `${usuario.email}`, 'success')
              return resp.usuario;
          }),
          catchError(err =>{
            console.log(err.error.mensaje);
            swal(err.error.mensaje, err.error.errors.message, 'error')
            return throwError(err)
          })
        );
  }

  actualizarUsuario(usuario:Usuario){
    let url = URL_SERVICIOS +'/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
        .pipe(
          map((resp:any)=>{
            if (usuario._id === this.usuario._id) {
              this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu)
            }
            swal('Usuario actualizao', `${usuario.nombre}`, 'success')
            return true;
          }),
          catchError(err =>{
            console.log(err.error.mensaje);
            swal(err.error.mensaje, err.error.errors.message, 'error')
            return throwError(err)
          })
        )
  }

  guardarStorage(id:string, token:string, usuario:Usuario, menu:any){
    localStorage.setItem('id', id)
    localStorage.setItem('usuario',JSON.stringify(usuario))
    localStorage.setItem('token', token)
    localStorage.setItem('menu',JSON.stringify(menu))
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  cargarStorage(){
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'))
      this.menu = JSON.parse(localStorage.getItem('menu'))
    }else{
      this.token = '';
      this.usuario = null;
      this.menu = [];
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
          this.guardarStorage(id, this.token, this.usuario, this.menu)
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
