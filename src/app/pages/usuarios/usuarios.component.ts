import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/services.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios:Usuario[] = [];
  desde:number = 0;
  totalRegistros:number = 0;
  cargando:boolean = true;

  constructor(public _usuarioService:UsuarioService, public _modalUploadService:ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe(resp => this.cargarUsuarios());
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
        .subscribe((resp:any) =>{
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuarios;
          this.cargando = false;
        })
  }

  cambiarDesde(valor:number){
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros || desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino:string){
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino)
      .subscribe((usuarios:any)=>{
        this.usuarios = usuarios;
        this.cargando = false;
      })
  }

  borrarUsuario(usuario:Usuario){
    if (usuario._id === this._usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No puede borrarse a si mismo', 'error')
      return;
    }
    swal({
      title: 'Esta seguro?',
      text: 'Esta apunto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then( borrar =>{
      if (borrar) {
        this._usuarioService.borrarUsuario(`${usuario._id}`)
            .subscribe( (borrado:Boolean)=>{
              this.cargarUsuarios();
            })
      }
    })
  }

  guardarUsuario(usuario:Usuario){
    this._usuarioService.actualizarUsuario(usuario)
        .subscribe();
  }

  mostrarModal(id:string){
    this._modalUploadService.mostrarModal('usuarios', id);
  }
}
