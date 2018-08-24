import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Photo } from '../../../core/models/photo.model';
import { PhotosService } from '../../../core/services/photos.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userData;
  userForm: FormGroup;
  isAdmin: boolean;
  file: File;
  url;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private photoService: PhotosService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.parseInitialData();

    this.authService.isAdmin()
      .then((res) => {
        this.isAdmin = res
      })
  }

  edit() {
    if (this.userForm.valid) {
      let fullName = this.userForm.get('fullName').value;
      let profilePicture: File = this.userForm.get('profilePicture').value;
      let location = this.userForm.get('location').value;
      let website = this.userForm.get('website').value;
      let bio = this.userForm.get('bio').value;

      if (profilePicture) {
        this.uploadNewProfilePicture(profilePicture, fullName)
          .then(photoUrl => {
            this.updateUserData(fullName, photoUrl, location, website, bio);
          })
          .catch(console.error)
      } else {
        this.updateUserData(fullName, this.url, location, website, bio)
      }

    } else {
      let userControls = this.userForm.controls;

      let fullname = userControls.fullName;
      let location = userControls.location;
      let website = userControls.website;
      let bio = userControls.bio;

      if (fullname.invalid) {
        if (fullname.errors.required) {
          this.toastr.error('Full name is required')
        } else if (fullname.errors.pattern) {
          this.toastr.error('Invalid name pattern')
          this.toastr.info('Full name must be at least two names separated by single space')
        }
      }

      if (location.invalid) {
        if (location.errors.pattern) {
          this.toastr.error('Location can contain only alphabetical characters, dashes, spaces, commas and dots.');
        } else if (location.errors.minlength || location.errors.maxlength) {
          this.toastr.error('Location length must be between 2 and 30 characters.');
        }
      }

      if (website.invalid) {
        if (website.errors.pattern) {
          this.toastr.error('Invalid URL')
        }
      }

      if (bio.invalid) {
        if (website.errors.pattern) {
          this.toastr.error('Invalid characters')
        }
      }
    }
  }

  updateUserData(fullName, photoUrl, location, website, bio) {
    this.authService
      .updateUser(fullName, photoUrl, location, website, bio)
      .then(() => {
        this.toastr.success('Profile updated');
        this.router.navigate([`/user/profile/${this.userData.userId}`]);

        this.authService.updateStorageValues(fullName, photoUrl);
      })
      .catch(console.error)
  }

  uploadNewProfilePicture(profilePicture: File, fullName) {
    return new Promise<any>((resolve, reject) => {
      let uploadPhoto = new Photo(profilePicture, fullName);
      this.photoService.uploadProfilePicture(uploadPhoto)
        .then((photoId) => {
          resolve(photoId);
        })
        .catch((err) => {
          reject(err)
        });
    })
  }

  enableAdminRole() {
    if (this.isAdmin) {
      this.authService.makeAdmin(this.userData.userId)
        .then(() => {
          this.parseInitialData();
          this.toastr.info(`${this.userData.fullName} is an administrator now`)
        })
    }
  }

  disableAdminRole() {
    if (this.isAdmin) {
      this.authService.removeAdminRole(this.userData.userId)
        .then(() => {
          this.parseInitialData();
          this.toastr.info(`${this.userData.fullName} is no longer an administrator`)
        })
    }
  }

  private parseInitialData() {
    this.route.url
      .subscribe((params) => {
        let userId = params[1].path;

        this.authService.getUserById(userId)
          .then(res => {
            this.userData = res;
            this.url = res.profilePicture;

            let location = this.userData.location ? this.userData.location : '';
            let website = this.userData.website ? this.userData.website : '';
            let bio = this.userData.bio ? this.userData.bio : '';

            this.userForm = this.fb.group({
              'fullName': [this.userData.fullName, [Validators.required, Validators.pattern('^[A-Za-zА-Яа-я -]+ [A-Za-zА-Яа-я -]+$')]],
              'profilePicture': [null],
              'location': [location, [Validators.pattern('^[A-Za-zА-Яа-я ,\.-]+$'), Validators.minLength(2), Validators.maxLength(30)]],
              'website': [website, [Validators.pattern('^[http|https|:|/]*[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$')]],
              'bio': [bio, [Validators.pattern('^[^><$}{\][\'\"|.+]+$')]]
            });
          })
          .catch(err => {
            console.error(err);
          })
      })
  }

  saveImage($event) {
    this.readUrl($event);

    let file = <File>$event.target.files[0];
    this.userForm.get('profilePicture').setValue(file);
  }

  private readUrl(event: any) {
    this.url = undefined;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
