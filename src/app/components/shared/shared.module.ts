import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { UserRoutingModule } from '../user/user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonModule,
    UserRoutingModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class SharedModule { }
