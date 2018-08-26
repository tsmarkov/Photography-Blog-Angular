import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PhotosAllComponent } from "./photos-all/photos-all.component";
import { PhotoUploadComponent } from "./photo-upload/photo-upload.component";
import { PhotoEditComponent } from "./photo-edit/photo-edit.component";
import { PhotoPreviewComponent } from "./photo-preview/photo-preview.component";
import { AuthenticationGuard } from "../../core/guards/authentication.guard";
import { ProfileGuard } from "../../core/guards/profile.guard";
import { PhotoGuard } from "../../core/guards/photo.guard";


const photoRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'all' },
    { path: 'all', component: PhotosAllComponent },
    { path: 'upload', component: PhotoUploadComponent, canActivate: [AuthenticationGuard] },
    { path: 'edit/:id', pathMatch: 'full', component: PhotoEditComponent, canActivate: [PhotoGuard] },
    { path: 'preview/:id', pathMatch: 'full', component: PhotoPreviewComponent, canActivate: [AuthenticationGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(photoRoutes)],
    exports: [RouterModule]
})
export class PhotosRoutingModule { }