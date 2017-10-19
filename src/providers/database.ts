import { Component, Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class Database {

  private user: User = {} as User;

  constructor(private afAuth: AngularFireAuth, private afData: AngularFireDatabase,
    private fb: Facebook, private platform: Platform) {
  }

  login(user: User) : Promise<any> {
    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      return result;
    }
    catch (e) {
      console.error(e);
      return e;
    }
  }

  registerEmail(user: User) : Promise<any> {
    try {
      const result = this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      console.log("User created");
      return result;
    }
    catch (e) {
      console.log("ERROR: User NOT created");
      return e;
    }
  }

  // facebookRegister() : Promise<any> {
  //   user : User = facebookLogin();
  //
  // }
  facebookRegister() : Promise<any> {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        //TODO: add user picture and name here as well
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.setProfilePicture(res.user.uid, res.additionalUserInfo.profile.picture.data.url);
          this.setUserFirstName(res.user.uid, res.additionalUserInfo.profile.first_name);
          this.setUserLastName(res.user.uid, res.additionalUserInfo.profile.last_name);
        });
    }
  }

  googleLogin() : Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  setProfilePicture(userId, imageUrl) : Promise<any> {
    return firebase.database().ref('users/' + userId).child('profile_picture').set(imageUrl);
  }

  setUserFirstName(userId, firstName) : Promise<any> {
    return firebase.database().ref('users/' + userId).child('first_name').set(firstName);
  }

  setUserLastName(userId, lastName) : Promise<any> {
    return firebase.database().ref('users/' + userId).child('last_name').set(lastName);
  }

  getCurrentUserId() : any {
    if (firebase.auth().currentUser) {
      console.log(firebase.auth().currentUser.uid);
      return firebase.auth().currentUser.uid;
    } else {
      return null;
    }
  }

  getCurrentUserProfilePicture() : any {
    var userId = this.getCurrentUserId();
    if (userId) {
      firebase.database().ref('/users/' + userId + '/profile_picture').once('value',
        function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    } else {
      console.log("You need to log in");
    }
  }

  getCurrentUserFirstName() : any {
    var userId = this.getCurrentUserId();
    if (userId) {
      firebase.database().ref('/users/' + userId + '/first_name').once('value',
        function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    } else {
      console.log("You need to log in");
    }
  }

  getCurrentUserLastName() : any {
    var userId = this.getCurrentUserId();
    if (userId) {
      firebase.database().ref('/users/' + userId + '/last_name').once('value',
        function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    } else {
      console.log("You need to log in");
    }
  }

  addFriend(userId_1, userId_2) {
    firebase.database().ref('/users/' + userId_1 + '/friends').push().set({
      userId_2
    });
    firebase.database().ref('/users/' + userId_2 + '/friends').push().set({
      userId_1
    });
  }

  getCurrentUser(): User {

    return null;
  }

}
