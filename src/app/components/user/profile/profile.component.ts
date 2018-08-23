import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private userService: UserService,
    private photoService: PhotosService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadInitialUserData()
      .then((res) => {
        this.loadPhotos(res.userId)
          .then((res) => {
            if (res == null) {
              this.photos = []
            } else {
              this.photos = Object.values(res);
            }
          })
      })
      .catch((err) => {
        console.error(err);
      })
    // this.loadPhotos();
  }

  private loadPhotos(userId) {
    return this.photoService.getPhotosByUserId(userId);
  }

  private loadInitialUserData(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.route.url
        .subscribe((params) => {
          let userId = params[1].path;

          this.userService
            .getUserById(userId)
            .then(res => {
              this.user = res;
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
        });
    });
  }
}
