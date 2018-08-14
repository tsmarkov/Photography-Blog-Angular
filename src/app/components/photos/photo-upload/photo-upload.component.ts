import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { PhotosService } from '../../../core/services/photos.service';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent {
  constructor(private photoService: PhotosService) { }

  onSubmit($event) {
    let file = <File>$event.target[0].files[0];
    console.log(file);

    this.photoService.upload(file)
  }
}
