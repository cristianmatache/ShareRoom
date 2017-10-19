import { Component, Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class Database {

  constructor(private afAuth: AngularFireAuth,
    private fb: Facebook, private platform: Platform) {
  }

  login(user: User) : Promise {
    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        this.navCtrl.setRoot('HomePage');
      }
      return result;
    }
    catch (e) {
      console.error(e);
      return e;
    }
  }

  registerEmail(user: User) : Promise {
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

  facebookLogin() : Promise<User> {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }

  googleLogin() : Promise {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

}
