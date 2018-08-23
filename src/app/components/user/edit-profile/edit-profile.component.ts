import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  userData;
  userForm;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.parseInitialData();
  }

  edit() {
    if (this.userForm.valid) {
      let fullName = this.userForm.get('fullName').value;
      let profilePicture = this.userForm.get('profilePicture').value;
      let location = this.userForm.get('location').value;
      let website = this.userForm.get('website').value;
      let bio = this.userForm.get('bio').value;

      this.userService
        .updateUser(fullName, profilePicture, location, website, bio)
        .then((res) => {
          this.toastr.success('Profile updated');
          this.router.navigate(['/']);

          this.userService.updateStorageValues(fullName, profilePicture);
        })
        .catch(console.error)
    } else {
      this.toastr.error('Profile update failed');
    }
  }

  deleteConfirm() {
    var txt;
    var r = confirm("Press a button!");
    if (r == true) {
      txt = "You pressed OK!";
    } else {
      txt = "You pressed Cancel!";
    }
    document.getElementById("demo").innerHTML = txt;
  }

  private parseInitialData() {
    this.route.url
      .subscribe((params) => {
        let userId = params[1].path;

        this.userService.getUserById(userId)
          .then(res => {
            this.userData = res;

            let location = this.userData.location ? this.userData.location : '';
            let website = this.userData.website ? this.userData.website : '';
            let bio = this.userData.bio ? this.userData.bio : '';

            this.userForm = this.fb.group({
              'fullName': [this.userData.fullName],
              'profilePicture': [this.userData.profilePicture],
              'location': [location],
              'website': [website],
              'bio': [bio]
            });
          })
          .catch(err => {
            console.error(err);
          })
      })
  }
}
