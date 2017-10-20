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

  facebookRegister() : Promise<any> {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential).then(res =>
        this.saveBasicUserInfo(res.user.uid, res.user.displayName,
          res.additionalUserInfo.profile.picture.data.url,
          res.user.emailVerified, res.user.phoneNumber, res.user.email))});
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res =>
        { console.log(res);
      this.saveBasicUserInfo(res.user.uid, res.user.displayName,
        res.additionalUserInfo.profile.picture.data.url,
        res.user.emailVerified, res.user.phoneNumber, res.user.email);});
    }
  }

  googleLogin() : Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  saveBasicUserInfo(uid: string, display_name : string, profile_picture: string,
                    email_verified : string, phone_number: string, email : string) {
    this.saveUserInfoParam(uid, 'display_name', display_name);
    this.saveUserInfoParam(uid, 'profile_picture', profile_picture);
    this.saveUserInfoParam(uid, 'email_verified', email_verified);
    this.saveUserInfoParam(uid, 'phone_number', phone_number);
    this.saveUserInfoParam(uid, 'email', email);
  }

  private saveUserInfoParam(uid : string, param : string, value: string) {
    firebase.database().ref('users/' + uid + '/' + param).set(value);
  }

  getCurrentUserId() : any {
    if (firebase.auth().currentUser) {
      console.log(firebase.auth().currentUser.uid);
      return firebase.auth().currentUser.uid;
    } else {
      return null;
    }
  }

  getUserInfoById(uid : string) : any {
    if (firebase.auth().currentUser) {
      //TODO
    } else {
      return null;
    }
  }

  getCurrentUser() : User {
    var current_user = firebase.auth().currentUser;
    console.log(current_user);
    let user : User = {
      uid: current_user.uid,
      email: current_user.email,
      password: null,
      profile_picture: current_user.photoURL,
      display_name: current_user.displayName,
      emailVerified: current_user.emailVerified,
      phoneNumber: current_user.phoneNumber
    };
    return user;
  }

  private getCurrentUserParam(param_name) : any {
    var userId = this.getCurrentUserId();
    if (userId) {
      firebase.database().ref('/users/' + userId + '/' + param_name).once('value',
        function(snapshot) {
          console.log(snapshot.val());
          return snapshot.val();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    } else {
      console.log("You need to log in");
    }
  }

  // addFriend(userId_1, userId_2) {
  //   firebase.database().ref('/users/' + userId_1 + '/friends').push().set({
  //     userId_2
  //   });
  //   firebase.database().ref('/users/' + userId_2 + '/friends').push().set({
  //     userId_1
  //   });
  // }

}
