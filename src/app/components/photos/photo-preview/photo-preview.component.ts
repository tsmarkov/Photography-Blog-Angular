import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotosService } from '../../../core/services/photos.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-photo-preview',
  templateUrl: './photo-preview.component.html',
  styleUrls: ['./photo-preview.component.css']
})
export class PhotoPreviewComponent implements OnInit {
  id: string;
  photo;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotosService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.url.subscribe((params) => {
      this.id = params[1].path;

      this.photoService.getByName(this.id)
        .then(data => this.photo = data)
    })
  }

  deletePhoto() {
    this.photoService
      .delete(this.id, this.photo.category, this.photo.userId)
      .then(() => {
        this.toastr.success('Photo deleted successfully');

        this.router.navigate(['/photos/all'])
      })
      .catch(err => {
        console.error(err);
        this.toastr.error(err);
      });
  }
}
