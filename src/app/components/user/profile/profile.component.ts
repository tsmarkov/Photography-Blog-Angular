import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../../../core/services/photos.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  photos;
  isAdmin;

  constructor(
    private authService: AuthenticationService,
    private photoService: PhotosService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadInitialUserData()
      .then((userData) => {
        this.loadPhotos(userData.userId)
          .then((photosData) => {
            if (photosData == null) {
              this.photos = []
            } else {
              this.photos = Object.values(photosData);
            }
          })
      })
      .catch((err) => {
        console.error(err);
      })

    this.authService.isAdmin()
      .then((res) => {
        this.isAdmin = res;
      })
  }

  private loadPhotos(userId) {
    return this.photoService.getPhotosByUserId(userId);
  }

  private loadInitialUserData(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.route.url
        .subscribe((params) => {
          let userId = params[1].path;

          this.authService
            .getUserById(userId)
            .then(res => {
              this.user = res;
              return resolve(res);
            })
            .catch(err => {
              return reject(err);
            });
        });
    });
  }
}
