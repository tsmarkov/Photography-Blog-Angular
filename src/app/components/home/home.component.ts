import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isAdmin;
  
  constructor(private authService: AuthenticationService) {
    this.authService.isAdmin()
      .then((res) => {
        this.isAdmin = res
      })
  }
}
