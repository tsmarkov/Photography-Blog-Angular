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

      this.comp()
        .then((users) => {
          let usersVal = users ? Object.values(users) : [];
          let isfr = true;
          usersVal.forEach(element => {
            if (element['email'] === email) {
              isfr = false;
            }
          });

          if (isfr) {
            this.toastr.error(emali);
            return;
          } else {
            this.authService.signIn(email, password)
              .then(() => {
                this.toastr.success('Signed in successfully');
                this.router.navigate(['/']);
              })
              .catch((err) => {
                this.toastr.error(err.message);
              })
          }
        })
    } else {
      let userControls = this.user.controls;

      let email = userControls.email;
      let password = userControls.password;

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
    }
  }

  private comp() {
    return this.authService.getAllUsers()
      .then((snapshot) => {
        return snapshot.val();
      })
  }
}
const emali = 'There is no user record corresponding to this indentifier. The user may have been deleted.';