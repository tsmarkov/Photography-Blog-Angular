import { Injectable } from "../../../../node_modules/@angular/core";
import * as firebase from 'firebase';
import { Photo } from '../models/photo.model'
import { async } from "../../../../node_modules/@angular/core/testing";

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    private basePath: string = '/uploads';
    private uploadTask: firebase.storage.UploadTask;

    upload(uploadPhoto: Photo) {
        let storageRef = firebase.storage().ref();
        this.uploadTask = storageRef.child(`${this.basePath}/${uploadPhoto.name}`).put(uploadPhoto);

        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                uploadPhoto.progress = (this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes)
            },
            (error) => {
                console.error(error);
            },
            () => {
                // Get image's download URL
                this.uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        uploadPhoto.url = downloadURL;
                        uploadPhoto.name = uploadPhoto.file.name;
                    });

                // name = uploadPhoto.name;
            })
    }
}