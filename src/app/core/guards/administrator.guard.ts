import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdministratorGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let canActivate = this.check() ? true : false;
    return canActivate;
  }

  check() {
    if (this.authService)
      this.authService.isAdmin()
        .then((res) => {
          if (res.admin) {
            console.log('admin true');
            return true;
          } else {
            console.log('admin false');
            this.router.navigate(['/auth/signin'])
            return false;
          }
        }).catch((err) => {
          console.error(err);
          return false;
        });
  }
}