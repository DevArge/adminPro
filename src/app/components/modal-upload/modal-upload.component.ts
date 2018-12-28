import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  
  imagenSubir:File;
  imagenTemporal:string;

  constructor(public _cargaArchivoService:SubirArchivoService, public _modalUploadService:ModalUploadService) { 
    
  }

  ngOnInit() {
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

  subirImagen(){
    this._cargaArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
          .then(resp =>{
            this._modalUploadService.notificacion.emit(resp);
            this.cerrarModal();
          })
          .catch(error =>{

          })
  }

  cerrarModal(){
    this.imagenTemporal = null;
    this.subirImagen = null;
    this._modalUploadService.ocultarModal();
  }

}
