import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  saveUser(userId: string, username: string): Promise<any> {
    return firebase.database().ref('/users/' + userId)
      .set({
        userId: userId,
        username: username
      });
  }

  savePhotoIdToUser(userId: string, photoId: string): Promise<any> {
    return firebase.database()
      .ref(`/users/${userId}/photos/${photoId}`)
      .set({ photoId })
  }

  removePhotoIdFromUser(userId: string, photoId: string): Promise<any> {
    return firebase.database()
      .ref(`/users/${userId}/photos/`)
      .child(photoId)
      .remove();
  }

  getUsername(): string {
    return sessionStorage.getItem('username');
  }

  getProfilePicture(): string {
    return sessionStorage.getItem('profilePicture');
  }
}
