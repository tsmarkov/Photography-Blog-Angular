import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  public user;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
    this.user = fb.group({
      email: [''],
      password: [''],
      confirmPassword: [''],
      displayName: [''],
      profilePictureURL: ['../../../../assets/images/default_profile_picture.jpg']
    })
  }

  signUp() {
    let userValue = this.user.value;

    let email: string = userValue.email;
    let password: string = userValue.password;
    let displayName: string = userValue.displayName;
    let profilePictureURL: string = userValue.profilePictureURL;

    this.authService.signUp(email, password, displayName, profilePictureURL)
  }
}
