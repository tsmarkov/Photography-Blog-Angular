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
    upload(uploadPhoto: Photo) {
        let storageRef = firebase.storage().ref();
        let photoNewName = this.generateName(uploadPhoto.file.name);

        this.uploadTask = storageRef.child(`${this.basePath}/${photoNewName}`).put(uploadPhoto.file);

        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                uploadPhoto.progress =
                    this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes;
            },
            (err) => {
                this.toastr.error(err.message);
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
                        this.userService.savePhotoIdToUser(userId, photoNewName);

                        // Add photo id to category in db
                        this.categoryService.addPhotoIdToCategory(photoNewName, uploadPhoto.category)

                        this.toastr.success('Image successfully uploaded');
                    });
            })
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

        firebase.database()
            .ref(`/photos/${name}`)
            .update({
                title,
                location,
                description,
                category: newCategory
            })
            .then(res => this.toastr.success('Photo edited successfully'))
            .catch(err => this.toastr.error(err));
    }

    delete(photoId: string, category: string, userId: string) {
        firebase.storage()
            .ref(`uploads/${photoId}`)
            .delete()
            .then(() => {
                firebase.database()
                    .ref(`/photos/`)
                    .child(photoId)
                    .remove(() => {
                        this.userService.removePhotoIdFromUser(userId, photoId);
                        this.categoryService.deletePhotoFromCategory(category, photoId);
                    })
                    .then(() => this.toastr.success('Photo deleted'))
            })
            .catch(() => this.toastr.error('Could not delete the photo'))
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
