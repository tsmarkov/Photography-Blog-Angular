import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PhotosService } from '../../core/services/photos.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  photos;

  constructor(private authService: AuthenticationService, private photoService: PhotosService) {
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.photoService.getAll()
        .then((res) => {
          this.photos = res ? Object.values(res).reverse().slice(0, 3) : [];
          console.log(this.photos);

          // setTimeout(()=>{
          this.slider();
          // }, 5000);
        })
        .catch(console.error)
    }
  }

  slider() {
    $("#slideshow > div:gt(0)").hide();

    setInterval(function () {
      $('#slideshow > div:first')
        .slideUp(4000)
        .next()
        .fadeIn(4000)
        .end()
        .appendTo('#slideshow');
    }, 10000);
  }
}
