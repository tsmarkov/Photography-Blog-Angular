import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import * as firebase from 'firebase';
import { UserRoutingModule } from '../user/user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonModule,
    UserRoutingModule
  ],
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent]
})
export class SharedModule { }
