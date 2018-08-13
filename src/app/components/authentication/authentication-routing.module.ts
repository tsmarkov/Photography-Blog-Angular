import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';

export const authenticationRoutes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'signout', component: SignOutComponent }
]

@NgModule({
    imports: [RouterModule.forChild(authenticationRoutes)],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { }