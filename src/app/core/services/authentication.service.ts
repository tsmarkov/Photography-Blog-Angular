import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(
        private router: Router,
        private toastr: ToastrService,
        private userService: UserService
    ) { }

    signUp(email: string, password: string, displayName: string, photoURL: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((res) => {
                // Save user data to RealtimeDatabase
                this.userService.saveUser(res.user.uid, displayName);

                firebase.auth()
                    .currentUser
                    .updateProfile({
                        displayName,
                        photoURL
                    }).then(data => {
                        this.signIn(email, password);
                    })
            })
            .catch(err => this.toastr.error(err))
    }

    signIn(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userData => {
                firebase.auth().currentUser.getIdToken()
                    .then((token: string) => {
                        sessionStorage.setItem('authToken', token);
                        sessionStorage.setItem('username', userData.user.displayName);
                        sessionStorage.setItem('profilePicture', userData.user.photoURL);
                        sessionStorage.setItem('userId', userData.user.uid);

                        this.toastr.success('Signed in successfully');
                        this.router.navigate(['/']);
                    })
            })
            .catch(err => {
                this.toastr.error(err);
            })
    }

    signOut() {
        firebase.auth().signOut()
            .then(() => {
                this.clearStorage();

                this.router.navigate(['/'])
                this.toastr.success('Signed out successfully')
            })
            .catch(err => {
                this.toastr.error(err);
            })
    }

    isAuthenticated(): boolean {
        return sessionStorage.getItem('authToken') != null;
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