import { Injectable } from "../../../../node_modules/@angular/core";
import { Photo } from '../models/photo.model'
import { ToastrService } from "../../../../node_modules/ngx-toastr";
import { UserService } from "./user.service";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private toastr: ToastrService, private userService: UserService) { }

  // Add photoId to specific category in db 
  addPhotoIdToCategory(photId: string, categoryName: string): Promise<any> {
    if (!this.isExisting(categoryName)) {
      this.createCategory(categoryName);
    }

    return firebase.database()
      .ref(`/categories/${categoryName}/${photId}`)
      .set({ photId })
  }

  // Delete photo by id from category
  deletePhotoFromCategory(category: string, photoId: string): Promise<any> {
    return firebase.database()
      .ref(`/categories/${category}/`)
      .child(photoId)
      .remove();
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
