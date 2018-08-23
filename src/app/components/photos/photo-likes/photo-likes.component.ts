import { Component, OnInit, Input } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-photo-likes',
  templateUrl: './photo-likes.component.html',
  styleUrls: ['./photo-likes.component.css']
})
export class PhotoLikesComponent implements OnInit {
  likes;
  isLiked: boolean;
  @Input('id') photoId: string;

  constructor(private photoService: PhotosService, private userService: UserService) { }

  ngOnInit() {
    this.loadLikes();
  }

  like() {
    let userId = this.userService.getUserId();
    let username = this.userService.getUsername();

    this.photoService
      .likePhoto(this.photoId, userId, username)
      .then(() => {
        this.loadLikes();
      })
      .catch((err) => { console.error(err) })
  }

  dislike() {
    let userId = this.userService.getUserId();
    let username = this.userService.getUsername();

    this.photoService
      .dislikePhoto(this.photoId, userId, username)
      .then(() => {
        this.loadLikes();
      })
      .catch((err) => { console.error(err) })
  }

  click() {
    if (this.isLiked) {
      this.dislike();
    } else {
      this.like();
    }
  }

  private loadLikes() {
    this.photoService.getAllLikes(this.photoId)
      .then((data) => {
        if (data == null) {
          this.likes = [];
          data = {};
        } else {
          this.likes = Object.values(data);
        }

        let userId = this.userService.getUserId();
        if (data.hasOwnProperty(userId)) {
          this.isLiked = true;
        } else {
          this.isLiked = false;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
