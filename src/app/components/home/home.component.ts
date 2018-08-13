import { Component, OnInit } from '@angular/core';
import { Url } from 'url';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string;
  profilePicture: string;

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.profilePicture = sessionStorage.getItem('profilePicture');
  }
}
