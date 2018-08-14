import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsername() {
    return sessionStorage.getItem('username');
  }

  getProfilePicture() {
    return sessionStorage.getItem('profilePicture');
  }
}
