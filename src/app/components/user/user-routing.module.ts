import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const userRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'profile' },
    { path: 'profile', pathMatch:'full', redirectTo: `profile/${sessionStorage.getItem('userId')}`},
    { path: 'profile/:userId', component: ProfileComponent },
    { path: 'edit/:userId', component: EditProfileComponent },
]

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }