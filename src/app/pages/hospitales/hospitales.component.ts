import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  cargando:boolean = true;
  totalRegistros:number;
  hospitales:Hospital[] = [];
  desde:number = 0;

  constructor(public _hospitalesService:HospitalService, public _modalUploadService:ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe(resp=>{
      this.cargarHospitales();
    })
  }

  crearHospital(){
    swal('Digita el nombre del hospital',{
      content: {
        element: "input"
      },
      icon:'info'
    })
    .then((valor:string) => {
      if (!valor || valor.length === 0) {
        return;
      }
      let hospital:Hospital = {
        nombre: valor
      }
      this.cargando = true;
      this._hospitalesService.crearUnHospital(hospital)
          .subscribe((res:any)=>{
            swal('Hospital Creado!', 'El Hospital se ha creado correctamente', 'success');
            this.cargarHospitales();
            this.cargando = false;
          })
    });
  }

  cargarHospitales(){
    this.cargando = true;
    this._hospitalesService.cargarHospitales(this.desde)
        .subscribe((resp:any) =>{
          this.hospitales = resp.hospitales;
          this.totalRegistros = resp.total;
          this.cargando = false;
        })
  }

  buscarHospital(termino:string){
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this._hospitalesService.buscarHospital(termino)
        .subscribe((resp:any)=>{
          this.hospitales = resp.hospital;
          this.cargando = false;
        })
  }

  mostrarModal(id:string){
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  actualizarHospital(hospital:Hospital){
    this.cargando = true;
    this._hospitalesService.actualizarHospital(hospital._id, hospital)
        .subscribe((resp:any)=>{
          swal('Hospital Actualizado!', 'El Hospital se ha actualizado correctamente', 'success');
          this.cargarHospitales();
          this.cargando = false;
        })
  }

  borrarHospital(hospital:Hospital){
    swal({
      title: 'Esta seguro?',
      text: 'Esta apunto de borrar el hospital ' + hospital.nombre,
      icon: 'warning',
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then( borrar =>{
      if (borrar) {
        this.cargando = true;
        this._hospitalesService.borrarHospital(hospital._id)
        .subscribe((resp:any)=>{
          this.cargarHospitales();
          swal('Hospital Eliminado!', 'El Hospital se ha eliminado correctamente', 'success');
          this.cargando = false;
        })
      }
    })
  }

  cambiarDesde(valor:number){
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros || desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }

}
