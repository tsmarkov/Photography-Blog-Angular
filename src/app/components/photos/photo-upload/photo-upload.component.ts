import { Component } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { Photo } from '../../../core/models/photo.model';
import { FormBuilder, FormGroup, Validator, Validators } from '../../../../../node_modules/@angular/forms';
import categories from '../photo-categories';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent {
  photoInfo: FormGroup;
  url;
  categories: string[];

  constructor(private photoService: PhotosService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.photoInfo = this.fb.group({
      'title': [''],
      'location': [''],
      'description': [''],
      'category': ['', Validators.required],
      'image': [null, Validators.required]
    });

    this.categories = categories;
  }

  saveImage($event) {
    this.readUrl($event);

    let file = <File>$event.target.files[0];
    this.photoInfo.get('image').setValue(file);
  }

  upload() {
    if (this.photoInfo.valid) {
      let imageFile = this.photoInfo.get('image').value;
      let title = this.photoInfo.get('title').value;
      let location = this.photoInfo.get('location').value;
      let description = this.photoInfo.get('description').value;
      let category = this.photoInfo.get('category').value;

      let uploadPhoto = new Photo(imageFile, title, category, location, description);
      this.photoService.upload(uploadPhoto)
        .then((photoId) => {
          this.toastr.success("Photo uploaded successfully");
          this.router.navigate([`/photos/preview/${photoId}`]);
        })
        .catch((err) => {
          this.toastr.error(err);
        });
    } else {
      console.error(this.photoInfo);
    }
  }

  private readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
