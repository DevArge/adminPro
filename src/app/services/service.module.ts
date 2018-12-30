import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UsuarioService, 
         SettingsService, 
         SharedService, 
         SidebarService, 
         LoginGuardGuard,
         SubirArchivoService,
         MedicoService
        } from "./services.index";
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ], 
  providers:[
    SettingsService,
    SharedService, 
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService,
    MedicoService
  ]
})
export class ServiceModule { }
