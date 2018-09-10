import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PhotosService } from '../services/photos.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private photoService: PhotosService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let photoId = next.params.id;
    console.log(photoId);

    return this.check(photoId);
  }

  check(photoId: string): Promise<any> {
    return this.adminPermission()
      .then((res) => {
        let admin = res;
        let currentUser = this.authService.getUserId();

        if (admin) {
          return true;
        }

        return this.photoService
          .getByName(photoId)
          .then(data => {
            console.log(data.userId);
            console.log(currentUser);
            console.log(data.userId === currentUser);


            if (data.userId === currentUser) {
              return true;
            } else {
              this.toastr.error(`You don't have permission to access the requested data`);
              this.router.navigate(['/'])
              return false;
            }
          })
          .catch(err => this.toastr.error(err.message))
      })
      .catch((err) => {
        this.toastr.info(`Please authenticate`)
        this.toastr.error(`You don't have permission to access the requested data`)
        this.router.navigate(['/auth/signin'])
        return false;
      })
  }

  ownerPermission(userId: string): boolean {
    if (this.authService.getUserId() === userId) {
      return true;
    } else {
      return false;
    }
  }

  adminPermission(): Promise<any> {
    return this.authService.isAdmin();
  }

  private getPhoto(photoId: string) {
    return this.photoService.getByName(photoId)
  }
}
