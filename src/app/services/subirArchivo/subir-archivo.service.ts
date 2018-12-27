import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo(archivo:File, tipo:string, id:string){
    return new Promise((resolve, reject)=>{
      let formData = new FormData();
      let xhr = new XMLHttpRequest();
      formData.append('imagen', archivo, archivo.name);
      xhr.onreadystatechange = function(){// se preconfigura antes de hacer el envio
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {// estatus 200 es ok
            console.log('imagen subida');
             resolve(JSON.parse(xhr.response)); // aqui envia la resp del backend
          }else{
            console.log('Fallo la subida');
            reject(JSON.parse(xhr.response));
          }
        }
      }
      let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
      xhr.open('PUT', url, true);
      xhr.send(formData); // se envia la peticion
    });
  }
}
