import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/services.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos:Medico[] = [];
  cargando:boolean = true;

  constructor(public _medicoService:MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  buscarMedico(termino:string){
    if (termino.length <= 0) {
      this.cargarMedicos();
      return
    }
    this.cargando = true;
    this._medicoService.buscarMedico(termino)
      .subscribe((resp:any)=>{
        this.medicos = resp;
        this.cargando = false;
      })
  }

  cargarMedicos(){
    this._medicoService.cargarMedicos()
        .subscribe(resp => this.medicos = resp)
  }

  borrarMedico(medico:Medico){
    this._medicoService.borrarMedico(medico._id)
        .subscribe(()=> this.cargarMedicos());
  }

}
