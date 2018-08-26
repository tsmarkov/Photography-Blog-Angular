import { Component, OnInit, Input } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { FormBuilder, FormGroup, Validators, PatternValidator } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-comments',
  templateUrl: './photo-comments.component.html',
  styleUrls: ['./photo-comments.component.css']
})
export class PhotoCommentsComponent implements OnInit {
  @Input('id') photoId: string;
  commentForm: FormGroup;
  comments;
  isAdmin: boolean;

  constructor(private photoService: PhotosService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.commentForm = this.fb.group({
      message: ['', [Validators.required, Validators.pattern('^[^><}{$]+$')]]
    });
  }

  ngOnInit() {
    this.loadComments();

    this.authService.isAdmin()
      .then((res) => {
        this.isAdmin = res;
      })
  }

  comment() {
    if (this.commentForm.valid) {
      let userId = this.authService.getUserId();
      let username = this.authService.getUsername();
      let profilePicture = this.authService.getProfilePicture();
      let message = this.commentForm.get('message').value;


      this.photoService.commentPhoto(this.photoId, userId, profilePicture, username, message)
        .then(() => {
          this.loadComments();
          this.commentForm.reset();
        })
        .catch((err) => this.toastr.error(err));
    } else {
      let message = this.commentForm.controls.message;

      if (message.errors.required) {
        this.toastr.error('Write the comment first');
      } else if (message.errors.pattern) {
        this.toastr.error('Invalid characters in message');
      }
    }
  }

  removeComment(comment) {
    let commentId = comment.commentId;
    if (this.authService.getUserId() === comment.userId ||
      this.authService.isAdmin()) {
      let userId = this.authService.getUserId();
      let username = this.authService.getUsername();

      this.photoService.removeComment(this.photoId, commentId)
        .then(() => {
          this.loadComments();
        })
        .catch(console.error)
    } else {
      console.info("Can not delete comment: permission denied")
    }
  }

  private loadComments() {
    this.photoService
      .getAllComments(this.photoId)
      .then((res) => {
        if (res == null) {
          this.comments = [];
        } else {
          this.comments = Object.values(res).reverse();
          this.loadProfilePics();
        }
      })
      .catch(console.error);
  }

  private async loadProfilePics() {
    for (const comment of this.comments) {
      await this.authService.getProfilePictureByUserId(comment.userId)
        .then((res) => {
          if (res) {
            comment.profilePicture = res;
          } else {
            comment.profilePicture = '../../../../assets/images/not_found.jpg';
          }
        });
    }
  }
}
