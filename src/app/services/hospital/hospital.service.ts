import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(public http:HttpClient, public _usuarioService:UsuarioService) { }

  cargarHospitales(desde:number = 0){
    let url = `${URL_SERVICIOS}/hospital?desde=${desde}`;
    return this.http.get(url);
  }

  obtenerHospital(id:string){
    let url = `${ URL_SERVICIOS}/hospital/` + id;
    return this.http.get(url);
  }

  buscarHospital(termino:string){
    let url = `${URL_SERVICIOS}/busqueda/coleccion/hospital/${termino}`;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  crearUnHospital(hospital:Hospital){
    let url = `${URL_SERVICIOS}/hospital`;
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, hospital);
  }

  actualizarHospital(id:string, hospital:Hospital){
    let url = `${ URL_SERVICIOS}/hospital/` + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, hospital);    
  }

  borrarHospital(id:string){
    let url = `${ URL_SERVICIOS}/hospital/` + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url);
  }



}


