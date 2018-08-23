import { Component, OnInit, Input } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { UserService } from '../../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-photo-comments',
  templateUrl: './photo-comments.component.html',
  styleUrls: ['./photo-comments.component.css']
})
export class PhotoCommentsComponent implements OnInit {
  comments;
  commentForm: FormGroup;
  @Input('id') photoId: string;

  constructor(private photoService: PhotosService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadComments();
  }

  comment() {
    let userId = this.userService.getUserId();
    let username = this.userService.getUsername();
    let profilePicture = this.userService.getProfilePicture();
    let message = this.commentForm.get('message').value;

    this.photoService.commentPhoto(this.photoId, userId, profilePicture, username, message)
      .then(() => {
        this.loadComments();
        this.commentForm.reset();
      })
      .catch(console.error);
  }

  removeComment(commentId: string) {
    let userId = this.userService.getUserId();
    let username = this.userService.getUsername();

    this.photoService.removeComment(this.photoId, commentId)
      .then(() => {
        this.loadComments();
      })
      .catch(console.error)
  }

  private loadComments() {
    this.photoService
      .getAllComments(this.photoId)
      .then((res) => {
        if (res == null) {
          this.comments = [];
        } else {
          this.comments = Object.values(res).reverse();
        }
      })
      .catch(console.error);
  }
}
