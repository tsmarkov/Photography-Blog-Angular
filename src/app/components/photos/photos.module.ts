import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PhotoPreviewComponent } from './photo-preview/photo-preview.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { PhotoEditComponent } from './photo-edit/photo-edit.component';
import { PhotosAllComponent } from './photos-all/photos-all.component';
import { PhotosRoutingModule } from './photos-routing.module';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    PhotosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [PhotoPreviewComponent, PhotoUploadComponent, PhotoEditComponent, PhotosAllComponent]
})
export class PhotosModule { }
