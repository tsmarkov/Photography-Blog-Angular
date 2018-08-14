import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PhotosAllComponent } from "./photos-all/photos-all.component";
import { PhotoUploadComponent } from "./photo-upload/photo-upload.component";
import { PhotoEditComponent } from "./photo-edit/photo-edit.component";
import { PhotoPreviewComponent } from "./photo-preview/photo-preview.component";


const photoRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'all' },
    { path: 'all', component: PhotosAllComponent },
    { path: 'upload', component: PhotoUploadComponent },
    { path: 'edit/:id', pathMatch: 'full', component: PhotoEditComponent },
    { path: 'preview/:id', pathMatch: 'full', component: PhotoPreviewComponent },
]

@NgModule({
    imports: [RouterModule.forChild(photoRoutes)],
    exports: [RouterModule]
})
export class PhotosRoutingModule { }