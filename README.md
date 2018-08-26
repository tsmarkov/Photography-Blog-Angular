# Photography-Blog-Angular
"Angular Fundamentals - July 2018" Project Defense

*github: https://github.com/tsmarkov/Photography-Blog-Angular*

## Project Specification

**“Photography Blog”** is a web application for photographers to share and discover artistic photographies.
The client side of the app is built with **Angular 6**.
For backend are used **Firebase Realtime Database** and **Firebase storage** for storing profile pictures and users's photographies. 
Photography blog have users, photographies and photographies info. Each user can register, login and logout. 
*Every user* can preview all photographies in the **gallery** and filtering them by category. 
*Authenticated users* can view photographies and their details. Can like and comment all photos. **Upload, edit and delete** own. 
Also can view other users profiles and their uploaded photos.
*Admins* can edit and delete all users photos, edit and delete users profiles and give users administrator privileges.**

## Functionality

#### • User authentication
    ◦ Sign in existing user with email and password
    ◦ Sign up new user with email, full name and password
    ◦ Sign out from the application
    
#### • User profile
    ◦ Upload new profile picture
    ◦ Edit full name
    ◦ Add or edit optional properties
    ◦ Delete profile
    
#### • Photos
    ◦ Preview
    ◦ Category filter
    ◦ Upload
    ◦ Delete
    ◦ Edit information
    ◦ Like
        - unlike
    ◦ Comment
        - write
        - delete
        
        
## Starting the project
##### • Download the project
```
◦ git clone "https://github.com/tsmarkov/Photography-Blog-Angular.git"
```

##### • Setting up dependencies
    ◦ Open "Photography-Blog-Angular" folder
    ◦ npm install -E
    
##### • Setting up Firebase
    ◦ Create file "firebase.config.ts" in base folder
    ◦ Add new project in https://console.firebase.google.com/
    
#### • Copy your automaticly generated "Web Setup" configs and place it in "firebase.config.ts" coresponding properties
    ◦ export const firebaseConfig = {
          apiKey: "put-your-apiKey-here",
          authDomain: "your-authDomain-here",
          databaseURL: "put-your-databaseURL-here",
          projectId: "put-your-projectId-here",
          storageBucket: "put-your-storageBucket-here",
          messagingSenderId: "put-your-messagingSenderId-here"
      }
    
##### • Run it
    ◦ ng serve
    ◦ Starts on localhost:4200
