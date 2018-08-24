import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  public user: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.user = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      displayName: ['', [Validators.required, Validators.pattern('^[A-Za-zА-Яа-я -]+ [A-Za-zА-Яа-я -]+$')]],
      profilePictureURL: ['../../../../assets/images/default_profile_picture.jpg']
    })
  }

  signUp() {
    if (this.user.valid) {
      let userValue = this.user.value;

      let email: string = userValue.email;
      let password: string = userValue.password;
      let confirmPassword: string = userValue.confirmPassword;
      let displayName: string = userValue.displayName;
      let profilePictureURL: string = userValue.profilePictureURL;

      if (password !== confirmPassword) {
        this.toastr.error('Passwords must match');
        return;
      }

      this.authService.signUp(email, password, displayName, profilePictureURL)
        .then(() => {
          this.router.navigate(['/']);
          this.toastr.success('Registered successfully')
        })
        .catch(err => {
          this.toastr.error(err.message)
        })
    } else {
      let userControls = this.user.controls;

      let email = userControls.email;
      let password = userControls.password;
      let displayName = userControls.displayName;

      if (email.invalid) {
        if (email.errors.required) {
          this.toastr.error('Email is required')
        } else if (email.errors.email) {
          this.toastr.error('Invalid email pattern')
        }
      }

      if (password.invalid) {
        if (password.errors.required) {
          this.toastr.error('Password is required')
        } else if (password.errors.minlength) {
          this.toastr.error('Password must be at least six characters')
        }
      }

      if (displayName.invalid) {
        if (displayName.errors.required) {
          this.toastr.error('Full name is required')
        } else if (displayName.errors.pattern) {
          this.toastr.error('Invalid name pattern')
          this.toastr.info('Full name must be at least two names separated by single space')
        }
      }
    }
  }
}
