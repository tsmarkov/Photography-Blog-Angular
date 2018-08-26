import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotosService } from '../../../core/services/photos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit {
  id: string;
  photo: any;
  oldCategory: string;
  photoInfo: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotosService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  edit() {
    if (this.photoInfo.valid) {
      let title = this.photoInfo.get('title').value;
      let newCategory = this.photoInfo.get('category').value;
      let location = this.photoInfo.get('location').value;
      let description = this.photoInfo.get('description').value;

      this.photoService.edit(this.id, title, this.oldCategory, newCategory, location, description)
        .then(() => {
          this.toastr.success('Photo edited successfully')
          this.router.navigate([`/photos/preview/${this.id}`]);
        })
        .catch((err) => this.toastr.error(err.message));
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
          this.toastr.error('Category can contain only alphabetical characters, dashes and spaces.');
        }
      }

      if (location.invalid) {
        if (location.errors.pattern) {
          this.toastr.error('Location can contain only alphabetical characters, dashes, spaces, commas and dots.');
        } else if (location.errors.minlength || location.errors.maxlength) {
          this.toastr.error('Location length must be between 2 and 30 characters.');
        }
      }

      if (description.invalid) {
        if (description.errors.pattern) {
          this.toastr.error('Invalid characters in description: "<",">","{","}" or "$"');
        }
      }
    }
  }

  private loadData() {
    this.route.url.subscribe((params) => {
      this.id = params[1].path;

      this.photoService.getByName(this.id)
        .then(data => {
          this.photo = data;
          this.oldCategory = data.category;

          this.photoInfo = this.fb.group({
            'title': [this.photo.title, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            'location': [this.photo.location, [Validators.pattern('^[A-Za-zА-Яа-я ,\.-]+$'), Validators.minLength(2), Validators.maxLength(30)]],
            'category': [this.photo.category, [Validators.required, Validators.pattern('^[A-Za-zА-Яа-я -]+$'), Validators.minLength(2), Validators.maxLength(20)]],
            'description': [this.photo.description, [Validators.pattern('^[^><}{$]+$')]]
          });
        })
        .catch(console.error);
    })
  }
}
