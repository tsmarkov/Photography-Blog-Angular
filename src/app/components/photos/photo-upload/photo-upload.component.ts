import { Component } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { Photo } from '../../../core/models/photo.model';
import { FormBuilder, FormGroup, Validators } from '../../../../../node_modules/@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent {
  photoInfo: FormGroup;
  url;

  constructor(private photoService: PhotosService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.photoInfo = this.fb.group({
      'title': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      'location': ['', [Validators.pattern('^[A-Za-zА-Яа-я ,\.-]+$'), Validators.minLength(2), Validators.maxLength(30)]],
      'description': ['', [Validators.pattern('^[^><}{$]+$')]],
      'category': ['', [Validators.required, Validators.pattern('^[A-Za-zА-Яа-я -]+$'), Validators.minLength(2), Validators.maxLength(20)]],
      'image': [null, Validators.required]
    });
  }

  saveImage($event) {
    this.readUrl($event);

    let file = <File>$event.target.files[0];
    this.photoInfo.get('image').setValue(file);
  }

  upload() {
    if (this.photoInfo.valid) {
      this.toastr.info('Uploading photo...')
      let imageFile = this.photoInfo.get('image').value;
      let title = this.photoInfo.get('title').value;
      let location = this.photoInfo.get('location').value;
      let description = this.photoInfo.get('description').value;
      let category = this.photoInfo.get('category').value;

      let uploadPhoto = new Photo(imageFile, title, category, location, description);
      this.photoService.upload(uploadPhoto)
        .then((photoId) => {
          this.toastr.clear();
          this.toastr.success("Photo uploaded successfully");
          this.router.navigate([`/photos/preview/${photoId}`]);
        })
        .catch((err) => {
          this.toastr.error(err.message);
        });
    } else {
      let photoInfo = this.photoInfo.controls;

      let title = photoInfo.title;
      let category = photoInfo.category;
      let location = photoInfo.location;
      let description = photoInfo.description;

      if (title.invalid) {
        if (title.errors.required) {
          this.toastr.error('Title is required')
        } else if (title.errors.minlength || title.errors.minlength) {
          this.toastr.error('Title length must be between 2 and 20 charecters')
        }
      }

      if (category.invalid) {
        if (category.errors.required) {
          this.toastr.error('Category is required')
        } else if (category.errors.minlength || category.errors.maxlength) {
          this.toastr.error('Category length must be between 2 and 20 characters.');
        } else if (category.errors.pattern) {
          this.toastr.error('Category can contain only alphabetical characters, dashes and spaces');
        }
      }

      if (location.invalid) {
        if (location.errors.pattern) {
          this.toastr.error('Location can contain only alphabetical characters, dashes, spaces, commas and dots');
        } else if (location.errors.minlength || location.errors.maxlength) {
          this.toastr.error('Location length must be between 2 and 30 characters');
        }
      }

      if (description.invalid) {
        if (description.errors.pattern) {
          this.toastr.error('Invalid characters in description: "<",">","{","}" or "$"');
        }
      }
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
