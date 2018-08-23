import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  profilePicture: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userId = this.userService.getUserId();
    this.username = this.userService.getUsername();
    this.profilePicture = this.userService.getProfilePicture();
  }
}