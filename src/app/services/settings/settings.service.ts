import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  ajustes:Ajustes = {
    temaUrl: "assets/css/colors/default.css",
    tema:'default'
  }
  constructor(@Inject(DOCUMENT) private _document) { 
    this.cargarAjustes();
  }

  guardarAjustes(){
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes(){
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      // console.log('Cargando del localstorage');
      this.aplicarTema(this.ajustes.tema);
    }else{
      // console.log('Usando valores por defecto');
    }
  }

  aplicarTema(temaColor:string){
    let url = `assets/css/colors/${temaColor}.css`;
    this._document.getElementById('tema').setAttribute('href', url);
    this.ajustes.tema = temaColor;
    this.ajustes.temaUrl = url;
    this.guardarAjustes();
  }
}

interface Ajustes {
  temaUrl:string;
  tema:string;
}
