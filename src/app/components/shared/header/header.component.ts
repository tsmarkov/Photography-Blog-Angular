import { Component } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated: boolean;
  userId: string;
  user;
  username: string;
  profilePicture: string;

  constructor(
    private authService: AuthenticationService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.isAuthenticated) {
      this.userId = this.authService.getUserId();
      this.username = this.authService.getUsername();
      this.profilePicture = this.authService.getProfilePicture();
    }
  }
}