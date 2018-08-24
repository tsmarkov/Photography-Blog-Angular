import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotosService } from '../../../core/services/photos.service';
import { CategoryService } from '../../../core/services/category.service';
import { async } from 'q';

@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.css']
})
export class DeleteProfileComponent {
  userData;
  user: FormGroup;

  constructor(private authService: AuthenticationService,
    private photoService: PhotosService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.parseInitialData();

    this.user = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  reauthenticate() {
    let password: string = this.user.get('password').value;

    return this.authService.reauthenticate(password)
  }

  delete() {
    if (this.user.valid) {
      this.reauthenticate()
        .then((data) => {
          console.log('reauth ->', data);

          this.deletePhotos()
            .then(() => {
              console.log('photos deleted');

              this.authService.deleteUser(this.userData)
                .then(() => {
                  console.log('user deleted');

                  if (this.userData.userId === this.authService.getUserId()) {
                    this.authService.signOut()
                  }

                  this.router.navigate(['/']);
                  this.toastr.success('Account deleted successfully')
                })
            })
        })
        .catch((err) => {
          this.toastr.error(err.message)
        });
    } else {
      let passwordControl = this.user.controls;
      let password = passwordControl.password;

      if (password.invalid) {
        if (password.errors.required) {
          this.toastr.error('Password is required')
        } else if (password.errors.minlength) {
          this.toastr.error('Password must be at least six characters')
        }
      }
    }
  }

  cancel() {
    window.history.back();
  }

  private deletePhotos() {
    let userPhotos = this.userData.photos ?
      this.userData.photos : [];

    let allPhotos = Object.values(userPhotos);

    return new Promise<any>((resolve, reject) => {
      (async () => {
        for (const photoObj of allPhotos) {
          let photoId = photoObj['photoId'];

          await (() => {
            this.photoService.getByName(photoId)
              .then((photoData) => {
                let photoId = photoData.name;
                let category = photoData.category;
                let userId = photoData.userId;

                this.photoService.delete(photoId, category, userId)
                  .then((res) => {
                    console.log(`photo:${photoId} deleted : ${category} :`);
                  })
              })
          })();
        }
      })();
      resolve();
    })
  }

  private parseInitialData() {
    this.route.url
      .subscribe((params) => {
        let userId = params[1].path;

        this.authService.getUserById(userId)
          .then(res => {
            this.userData = res;
          })
          .catch(err => {
            console.error(err);
          })
      })
  }
}
