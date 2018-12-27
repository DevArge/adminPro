import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UsuarioService, 
         SettingsService, 
         SharedService, 
         SidebarService, 
         LoginGuardGuard 
        } from "./services.index";

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
    LoginGuardGuard
  ]
})
export class ServiceModule { }
