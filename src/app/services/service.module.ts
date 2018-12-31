import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UsuarioService, 
         SettingsService, 
         SharedService, 
         SidebarService, 
         LoginGuardGuard,
         SubirArchivoService,
         MedicoService,
         AdminGuard,
         VerificatokenGuard
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
    MedicoService,
    AdminGuard,
    VerificatokenGuard
  ]
})
export class ServiceModule { }
