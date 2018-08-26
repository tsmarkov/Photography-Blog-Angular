import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileGuard } from '../../core/guards/profile.guard';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';
import { AdministratorGuard } from '../../core/guards/administrator.guard';

export const userRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'profile' },
    { path: 'profile', pathMatch: 'full', canActivate: [AuthenticationGuard], redirectTo: `profile/${sessionStorage.getItem('userId')}` },
    { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthenticationGuard] },
    {
        path: 'edit/:userId',
        component: EditProfileComponent,
        canActivate: [ProfileGuard]
    },
    {
        path: 'delete/:userId',
        component: DeleteProfileComponent,
        canActivate: [ProfileGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }