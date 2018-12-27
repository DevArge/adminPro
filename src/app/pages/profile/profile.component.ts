import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/services.index';
import { log } from 'util';
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario:Usuario;
  imagenSubir:File;
  imagenTemporal:string;

  constructor(public _usuarioService:UsuarioService) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar(f:Usuario){
    if (!this.usuario.google) {
      this.usuario.email = f.email;
    }
    this.usuario.nombre = f.nombre;
    this._usuarioService.actualizarUsuario(this.usuario)
        .subscribe();
  }

  seleccionImagen(archivo:File){
    if (!archivo) {
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      swal('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp =  reader.readAsDataURL(archivo);
    reader.onloadend = ()=>{
      this.imagenTemporal = reader.result.toString(); 
    }
  }

  cambiarImagen(){
    this._usuarioService.cambiarImagen(this.imagenSubir, `${this.usuario._id}`)
  }
}
