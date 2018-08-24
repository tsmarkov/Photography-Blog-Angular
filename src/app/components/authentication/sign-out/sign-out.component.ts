import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-out',
  template: '<h1>Signing out...</h1>',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/'])
        this.toastr.success('Signed out successfully')
      })
      .catch(err => {
        console.error(err)
      });
  }
}
