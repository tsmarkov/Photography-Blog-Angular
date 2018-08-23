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
        });
    } else {
      this.toastr.error('Invalid form')
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
            'title': [this.photo.title, [Validators.required]],
            'location': [this.photo.location],
            'category': [this.photo.category, [Validators.required]],
            'description': [this.photo.description]
          });
        })
        .catch(console.error);
    })
  }
}
