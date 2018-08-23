import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { Photo } from '../../../core/models/photo.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-photos-all',
  templateUrl: './photos-all.component.html',
  styleUrls: ['./photos-all.component.css']
})
export class PhotosAllComponent implements OnInit {
  photos: Photo[];
  category: number;
  categories;

  constructor(private photoService: PhotosService, private categoryService: CategoryService) {
    this.category = -1;
  }

  ngOnInit() {
    this.loadAllPhotos();
    this.loadAllCategories();
  }

  changeCategory() {
    if (this.category === -1) {
      this.loadAllPhotos();
    } else if (this.category >= 0 && this.category < this.categories.length) {
      let categoryName = this.categories[this.category];

      let photos = [];

      this.photoService
        .getAllByCategory(categoryName)
        .then((res) => {
          let photosIds = this.parseObjectToArray(res);

          for (const element of photosIds) {
            this.photoService
              .getByName(element.photoId)
              .then((data) => {
                photos.push(data);
              })
          }

          this.photos = photos;
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.error("Invalid category");
    }
  }

  loadAllPhotos() {
    this.photoService.getAll()
      .then(data => {
        this.photos = this.parseObjectToArray(data);
      })
      .catch(err => console.error(err));
  }

  loadAllCategories() {
    this.categoryService.getAllCategories()
      .then((res: Object) => {
        let keys = Object.keys(res);
        this.categories = keys;
      })
  }

  private parseObjectToArray(data: Object) {
    if (data == null) {
      return [];
    }

    return Object.values(data);
  }
}
