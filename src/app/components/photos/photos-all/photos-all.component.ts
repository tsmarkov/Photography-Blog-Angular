import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../../../core/services/photos.service';
import { Photo } from '../../../core/models/photo.model';

@Component({
  selector: 'app-photos-all',
  templateUrl: './photos-all.component.html',
  styleUrls: ['./photos-all.component.css']
})
export class PhotosAllComponent implements OnInit {
  photos: Photo[];

  constructor(private photoService: PhotosService) { }

  ngOnInit() {
    this.photoService.getAll()
      .then(data => {
        this.photos = this.parsePhotos(data);
      })
      .catch(err => console.error(err));
  }

  private parsePhotos(data: Object) {
    if (data == null) {
      return [];
    }

    return Object.values(data);
  }
}
