import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  public user;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
    this.user = fb.group({
      email: [''],
      password: ['']
    })
  }

  signIn() {
    let userValue = this.user.value;
    let email: string = userValue.email;
    let password: string = userValue.password;

    this.authService.signIn(email, password)
  }
}
