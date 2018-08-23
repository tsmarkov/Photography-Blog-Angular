import { Injectable } from "../../../../node_modules/@angular/core";
import { Photo } from '../models/photo.model'
import { ToastrService } from "../../../../node_modules/ngx-toastr";
import { UserService } from "./user.service";
import * as firebase from 'firebase';
import { CategoryService } from "./category.service";

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    private basePath: string = '/uploads';
    private uploadTask: firebase.storage.UploadTask;

    constructor(private toastr: ToastrService,
        private userService: UserService,
        private categoryService: CategoryService) { }

    // Upload photo to Firebase storage and then saving photo info to database
    upload(uploadPhoto: Photo): Promise<any> {
        return new Promise((resolve, reject) => {
            let storageRef = firebase.storage().ref();
            let photoNewName = this.generateName(uploadPhoto.file.name);

            this.uploadTask = storageRef.child(`${this.basePath}/${photoNewName}`).put(uploadPhoto.file);

            this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    uploadPhoto.progress =
                        this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes;
                },
                (err) => {
                    reject(err.message);
                },
                () => {
                    // Get image's download URL
                    this.uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then(downloadURL => {
                            uploadPhoto.url = downloadURL;
                            uploadPhoto.name = uploadPhoto.file.name;

                            let user = sessionStorage.getItem('username');
                            let userId = sessionStorage.getItem('userId');

                            // Save photo info to firebase realtime db
                            this.savePhoto(downloadURL, photoNewName, user, userId, uploadPhoto);

                            // Save the unique photo name in user data
                            this.userService
                                .savePhotoIdToUser(userId, photoNewName, downloadURL);

                            // Add photo id to category in db
                            this.categoryService
                                .addPhotoIdToCategory(photoNewName, uploadPhoto.category);

                            resolve(photoNewName);
                        });
                })
        });
    }

    // Save photo info to database
    edit(name: string,
        title: string,
        oldCategory: string,
        newCategory: string,
        location: string,
        description: string) {

        if (oldCategory !== newCategory) {
            this.changeCategory(oldCategory, newCategory, name)
        }

        return firebase.database()
            .ref(`/photos/${name}`)
            .update({
                title,
                location,
                description,
                category: newCategory
            })
    }

    delete(photoId: string, category: string, userId: string) {
        return new Promise<any>((resolve, reject) => {
            firebase.storage()
                .ref(`uploads/${photoId}`)
                .delete()
                .then(() => {
                    firebase.database()
                        .ref(`/photos/`)
                        .child(photoId)
                        .remove(() => {
                            this.userService
                                .removePhotoIdFromUser(userId, photoId);

                            this.categoryService
                                .deletePhotoFromCategory(category, photoId);
                        }).then((res) => resolve(res))
                })
                .catch((err) => reject(err))
        })
    }

    getAllLikes(photoId: string) {
        return firebase.database()
            .ref(`/photos/${photoId}/likes`)
            .once('value')
            .then((snapshot) => {
                return snapshot.val();
            });
    }

    likePhoto(photoId: string, userId: string, username: string) {
        return firebase.database()
            .ref(`/photos/${photoId}/likes/`)
            .child(userId)
            .set({ userId, username });
    }

    dislikePhoto(photoId: string, userId: string, username: string) {
        return firebase.database()
            .ref(`/photos/${photoId}/likes/`)
            .child(userId)
            .remove();
    }

    getAllComments(photoId: string) {
        return firebase.database()
            .ref(`/photos/${photoId}/comments/`)
            .once('value')
            .then((snapshot) => {
                return snapshot.val();
            });
    }

    commentPhoto(photoId: string, userId: string, profilePicture: string, username: string, message: string) {
        let commentId = this.generateName(userId);
        let creationDate = new Date().toUTCString().replace(' GMT', '');

        return firebase.database()
            .ref(`/photos/${photoId}/comments/`)
            .child(commentId)
            .set({ commentId, userId, username, message, profilePicture, creationDate });
    }

    removeComment(photoId: string, commentId: string) {
        return firebase.database()
            .ref(`/photos/${photoId}/comments/`)
            .child(commentId)
            .remove();
    }

    // Get all photos from database
    getAll() {
        return firebase.database()
            .ref(`/photos`)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch(error => {
                console.log(error);
            })
    }

    // Get photo by name
    getByName(name) {
        return firebase.database()
            .ref(`/photos/${name}`)
            .once('value')
            .then(snap => {
                return snap.val();
            })
            .catch(err => {
                console.error(err);
            })
    }

    // Get all photos by category
    getAllByCategory(category) {
        return firebase.database()
            .ref(`/categories/${category}`)
            .once('value')
            .then(snap => {
                return snap.val();
            })
            .catch(err => {
                console.error(err);
            })
    }

    getPhotosByUserId(userId: string) {
        return firebase.database()
            .ref(`/users/${userId}/photos`)
            .once('value')
            .then((snapshot) => {
                return snapshot.val()
            })
            .catch((err) => {
                console.error(err);
            })
    }

    private changeCategory(oldCategory: string, newCategory: string, photoId: string) {
        this.categoryService
            .deletePhotoFromCategory(oldCategory, photoId)
            .then(() => {
                this.categoryService
                    .addPhotoIdToCategory(photoId, newCategory)
            })
            .catch(console.error);
    }

    // Save photo info to database
    private savePhoto(downloadURL: string, name: string, username: string, userId: string, uploadPhoto: Photo) {
        let creationDate =
            uploadPhoto.createdAt.toDateString() +
            " " +
            uploadPhoto.createdAt.toLocaleTimeString();

        firebase.database()
            .ref(`/photos/${name}`)
            .set({
                downloadURL,
                name,
                username,
                userId,
                creationDate,
                title: uploadPhoto.title,
                location: uploadPhoto.location,
                description: uploadPhoto.description,
                category: uploadPhoto.category
            })
            .then(res => console.info(res))
            .catch(err => console.error(err));
    }

    // Generating unique valid name for photo 
    private generateName(name: string) {
        let newName = name.replace(/[&;$"#}{\]\[\.]/g, "");
        return new Date().getTime() + newName;
    }
}
