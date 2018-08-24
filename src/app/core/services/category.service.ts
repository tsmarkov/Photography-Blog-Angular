import { Injectable } from "../../../../node_modules/@angular/core";
import { Photo } from '../models/photo.model'
import { ToastrService } from "../../../../node_modules/ngx-toastr";
import * as firebase from 'firebase';
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private toastr: ToastrService, private authService: AuthenticationService) { }

  // Add photoId to specific category in db 
  addPhotoIdToCategory(photoId: string, categoryName: string): Promise<any> {
    if (!this.isExisting(categoryName)) {
      this.createCategory(categoryName);
    }

    return firebase.database()
      .ref(`/categories/${categoryName}/${photoId}`)
      .set({ photoId })
  }

  // Delete photo by id from category
  deletePhotoFromCategory(category: string, photoId: string): Promise<any> {
    return firebase.database()
      .ref(`/categories/${category}/`)
      .child(photoId)
      .remove();
  }

  getAllCategories() {
    return firebase.database()
      .ref('/categories')
      .once('value')
      .then((snapshot) => {
        return snapshot.toJSON();
      })
      .catch(err => {
        console.error(err);
      })
  }

  // Create unexisting category in db
  private createCategory(categoryName: string): void {
    if (this.isExisting(categoryName)) {
      firebase.database()
        .ref(`/categories/${categoryName}`)
        .set({
          name: categoryName
        })
        .then(console.log)
        .catch(console.error);
    }
    else {
      console.info(`category already exists: ${categoryName}`);
    }
  }

  // Check if category exists in db
  private isExisting(categoryName: string): Promise<boolean> {
    return firebase.database()
      .ref(`/categories/${categoryName}`).once('value')
      .then(() => true)
      .catch(() => false)
  }
}
