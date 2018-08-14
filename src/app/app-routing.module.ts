import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: './components/authentication/authentication.module#AuthenticationModule' },
  { path: 'user', loadChildren: './components/user/user.module#UserModule', canActivate: [AuthenticationGuard] },
  { path: 'photos', loadChildren: './components/photos/photos.module#PhotosModule' },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }   