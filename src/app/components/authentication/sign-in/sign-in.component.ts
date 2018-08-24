import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  public user: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.user = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  signIn() {
    if (this.user.valid) {
      let userValue = this.user.value;
      let email: string = userValue.email;
      let password: string = userValue.password;

      this.authService.signIn(email, password)
        .then(() => {
          this.toastr.success('Signed in successfully');
          this.router.navigate(['/']);
        })
        .catch((err) => {
          this.toastr.error(err.message);
        })
    } else {
      let userControls = this.user.controls;

      let email = userControls.email;
      let password = userControls.password;

      if (email.invalid) {
        console.log(email.errors);
        if (email.errors.required) {
          this.toastr.error('Email is required')
        } else if (email.errors.email) {
          this.toastr.error('Invalid email pattern')
        }
      }

      if (password.invalid) {
        console.log(password.errors);
        if (password.errors.required) {
          this.toastr.error('Password is required')
        } else if (password.errors.minlength) {
          this.toastr.error('Password must be at least six characters')
        }
      }
    }
  }
}
