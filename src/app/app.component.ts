import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseConfig } from 'firebase.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {
    firebase.initializeApp(firebaseConfig);
  }
}
