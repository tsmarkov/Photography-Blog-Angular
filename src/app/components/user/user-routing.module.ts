import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileGuard } from '../../core/guards/profile.guard';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';

export const userRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'profile' },
    { path: 'profile', pathMatch: 'full', redirectTo: `profile/${sessionStorage.getItem('userId')}` },
    { path: 'profile/:userId', component: ProfileComponent, canActivate: [ProfileGuard] },
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