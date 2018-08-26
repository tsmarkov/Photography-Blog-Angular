import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PhotosService } from './photos.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(
        private router: Router,
        private toastr: ToastrService
    ) { }

    signUp(email: string, password: string, displayName: string, photoURL: string) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    // Save user data to RealtimeDatabase
                    this.saveUser(res.user.uid, email, displayName, photoURL)

                    firebase.auth()
                        .currentUser
                        .updateProfile({
                            displayName,
                            photoURL
                        }).then(data => {
                            this.signIn(email, password)
                                .then(resolve);
                        })
                })
                .catch(reject)
        })

    }

    signIn(email: string, password: string) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userData => {
                firebase.auth().currentUser.getIdToken()
                    .then((token: string) => {
                        this.saveToStorage(
                            token,
                            userData.user.displayName,
                            userData.user.photoURL,
                            userData.user.uid
                        );
                    })
            })
    }

    signOut() {
        return firebase.auth().signOut()
            .then(() => {
                this.clearStorage();
            })
    }

    reauthenticate(password: string) {
        const user = firebase.auth().currentUser;
        var credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );

        return user.reauthenticateAndRetrieveDataWithCredential(credentials)
    }

    isAuthenticated(): boolean {
        return sessionStorage.getItem('authToken') != null;
    }


    // USER OPERATIONS 

    saveUser(userId: string, email: string, username: string, photoURL: string): Promise<any> {
        return firebase.database()
            .ref(`/users/${userId}`)
            .set({
                userId: userId,
                email: email,
                fullName: username,
                profilePicture: photoURL,
                admin: false
            });
    }

    updateUser(fullName: string, profilePicture: string, location: string, website: string, bio: string) {
        return new Promise((resolve, reject) => {
            firebase.database()
                .ref(`/users/${this.getUserId()}`)
                .update({
                    fullName,
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

    deleteUser(userData): Promise<any> {
        let userId = userData.userId;
        let user = firebase.auth().currentUser;

        if (userId === user.uid) {
            return user.delete()
                .then(() => {
                    return this.deleteUserInfoFromDatabase(userId)
                })
                .catch((err) => {
                    console.log(err.message)
                })
        } else if (this.isAdmin()) {
            return this.deleteUserInfoFromDatabase(userId)
        } else {
            return new Promise<any>((resolve, reject) => {
                reject('Error: can not delete account without credentials or admin permission')
            })
        }
    }

    // PHOTOS TO USER

    saveProfilePicture(userId: string, profilePicture: string): Promise<any> {
        return firebase.database()
            .ref(`/users/${userId}`)
            .update({ profilePicture: profilePicture });
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

    // GET USER DATA

    getUsernameByUserId(userId: string) {
        return firebase.database()
            .ref(`users/${userId}/fullName`)
            .once('value')
            .then((snapshot) => {
                return snapshot.val();
            })
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

    getAllUsers() {
        return firebase.database()
            .ref(`users`)
            .once(`value`)
    }

    getProfilePictureByUserId(userId: string) {
        return firebase.database()
            .ref(`/users/${userId}/profilePicture`)
            .once('value')
            .then(snap => {
                return snap.val();
            })
            .catch(err => {
                console.error(err);
            })
    }

    isAdmin(): Promise<any> {
        if (!firebase.auth().currentUser) {
            return;
        } else {

            let userId = this.getUserId();

            return firebase.database()
                .ref(`/users/${userId}/admin`)
                .once('value')
                .then((snapshot) => {
                    return snapshot.val();
                })
        }
    }

    makeAdmin(userId: string) {
        return firebase.database()
            .ref(`/users/${userId}`)
            .update({ admin: true })
    }

    removeAdminRole(userId: string) {
        return firebase.database()
            .ref(`/users/${userId}`)
            .update({ admin: false })
    }

    // STORAGE

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

    private deleteUserInfoFromDatabase(userId: string) {
        return firebase.database()
            .ref(`users/${userId}`)
            .remove();
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

    async getToken() {
        await firebase.auth().currentUser.getIdToken()
            .then(token => {
                this.setToken(token);
            })
            .catch(err => {
                this.toastr.error(err);
            })

        return sessionStorage.getItem('authToken');
    }

    private setToken(token) {
        sessionStorage.setItem('authToken', token)
    }

    private clearStorage() {
        let i = sessionStorage.length;
        while (i--) {
            let key = sessionStorage.key(i);
            if (key) {
                sessionStorage.removeItem(key);
            }
        }
    }
}