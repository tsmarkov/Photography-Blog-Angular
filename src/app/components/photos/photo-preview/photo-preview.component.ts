import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../../../core/services/photos.service';

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
    private photoService: PhotosService) { }

  ngOnInit() {
    this.route.url.subscribe((params) => {
      this.id = params[1].path;

      this.photoService.getByName(this.id)
        .then(data => this.photo = data)
    })
  }

  deletePhoto() {
    console.log('In delete');
    
    // this.photoService
    //   .delete(this.id, this.photo.category, this.photo.userId);
  }
}
