import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';
import { ProfileGuard } from '../../core/guards/profile.guard';
import { AdministratorGuard } from '../../core/guards/administrator.guard';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import * as firebase from 'firebase';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ProfileComponent, EditProfileComponent, DeleteProfileComponent],
  providers: [AuthenticationGuard, ProfileGuard, AdministratorGuard]
})
export class UserModule { }
