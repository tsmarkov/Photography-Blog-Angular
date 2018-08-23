import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  saveUser(userId: string, email: string, username: string, photoURL: string): Promise<any> {
    return firebase.database().ref('/users/' + userId)
      .set({
        userId: userId,
        email: email,
        fullName: username,
        profilePicture: photoURL
      });
  }

  updateUser(title: string, profilePicture: string, location: string, website: string, bio: string) {
    return new Promise((resolve, reject) => {
      firebase.database()
        .ref(`/users/${this.getUserId()}`)
        .update({
          title,
          profilePicture,
          location,
          website,
          bio
        }).then(() => {
          resolve(this.updateProfilePicture(profilePicture));
        }).catch((err) => {
          reject(err)
        });
    })
  }

  savePhotoIdToUser(userId: string, photoId: string, photoURL: string): Promise<any> {
    return firebase.database()
      .ref(`/users/${userId}/photos/${photoId}`)
      .set({ photoId, photoURL });
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

  getUserId(): string {
    return sessionStorage.getItem('userId');
  }

  getUserById(userId: string) {
    return firebase.database()
      .ref(`/users/${userId}`)
      .once('value')
      .then(snap => {
        return snap.val();
      })
      .catch(err => {
        console.error(err);
      })
  }

  saveToStorage(authToken: string, displayName: string, photoURL: string, userId: string) {
    sessionStorage.setItem('authToken', authToken);
    sessionStorage.setItem('username', displayName);
    sessionStorage.setItem('profilePicture', photoURL);
    sessionStorage.setItem('userId', userId);
  }

  updateStorageValues(displayName: string, photoURL: string) {
    sessionStorage.setItem('username', displayName);
    sessionStorage.setItem('profilePicture', photoURL);
  }

  private updateProfilePicture(photoURL: string) {
    let displayName = firebase.auth().currentUser.displayName;

    return firebase.auth()
      .currentUser
      .updateProfile({
        displayName,
        photoURL
      })
  }
}
