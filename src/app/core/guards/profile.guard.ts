import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let userId = next.params.userId;
    return this.check(userId);
  }

  check(userId: string): Promise<any> {
    return this.adminPermission()
      .then((res) => {
        let admin = res;

        if (admin || this.ownerPermission(userId)) {
          return true;
        } else {
          this.toastr.info(`You don't have permission to access requested data`)
          this.router.navigate(['/'])
          return false;
        }
      })
      .catch((err) => {
        this.toastr.info(`Please authenticate`)
        this.toastr.error(`You don't have permission to access requested data`)
        this.router.navigate(['/auth/signin'])
        return false;
      })
  }

  ownerPermission(userId: string): boolean {
    if (this.authService.getUserId() === userId) {
      return true;
    } else {
      // console.log('owner false');
      return false;
    }
  }

  adminPermission(): Promise<any> {
    return this.authService.isAdmin();
  }
}
