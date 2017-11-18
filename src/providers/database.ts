import {User} from '../models/user';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Platform} from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import {Item} from "../models/item";
import { Geolocation } from '@ionic-native/geolocation';
import {Review} from "../models/review";
import {Injectable} from "@angular/core";


@Injectable()
export class Database {

  constructor(private afAuth: AngularFireAuth,
              private fb: Facebook, private platform: Platform,
              private geolocation : Geolocation) {
  }

  login(user: User): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  registerEmail(user: User): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  facebookRegister(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.fb.login(['email', 'public_profile']).then(res => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          firebase.auth().signInWithCredential(facebookCredential).then(res => {
            this.saveBasicUserInfo(res.user.uid, res.user.displayName,
              res.additionalUserInfo.profile.picture.data.url,
              res.user.emailVerified, res.user.phoneNumber, res.user.email);
            resolve();
          }).catch(reject);
        }).catch(reject);
      } else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
          console.log(res);
          this.saveBasicUserInfo(res.user.uid, res.user.displayName,
            res.additionalUserInfo.profile.picture.data.url,
            res.user.emailVerified, res.user.phoneNumber, res.user.email);
          resolve();
        }).catch(reject);
      }
    });
  }

  googleLogin(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  saveBasicUserInfo(uid: string, display_name: string, profile_picture: string,
                    email_verified: string, phone_number: string, email: string) {
    this.saveUserInfoParam(uid, 'display_name', display_name);
    this.saveUserInfoParam(uid, 'profile_picture', profile_picture);
    this.saveUserInfoParam(uid, 'email_verified', email_verified);
    this.saveUserInfoParam(uid, 'phone_number', phone_number);
    this.saveUserInfoParam(uid, 'email', email);
  }

  private saveUserInfoParam(uid: string, param: string, value: string) {
    firebase.database().ref('users/' + uid + '/' + param).set(value);
  }

  getCurrentUserId(): string {
    if (firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    } else {
      return null;
    }
  }

  getUserInfoById(uid: string): Promise<User> {

    console.log('UID IS: ' + uid);

    return new Promise<User>((resolve, reject) => {
      firebase.database().ref('/users/' + uid).once('value',
        function (snapshot) {
          var db_user = snapshot.val();
          let user: User = {
            uid: db_user.uid,
            email: db_user.email,
            password: null,
            profile_picture: db_user.profile_picture,
            display_name: db_user.display_name,
            emailVerified: db_user.email_verified,
            phoneNumber: db_user.phone_number,
            items: db_user.items,
            reviews: db_user.reviews
          };
          resolve(user);
        }, function (errorObject) {
          reject("Error on returning: " + errorObject.code);
        });
    });
  }

  /*private getCurrentUserParam(param_name : string) : Promise<string> {
    var userId = this.getCurrentUserId();
    if (userId) {
      return new Promise<string>((resolve, reject) => {
        firebase.database().ref('/users/' + userId + '/' + param_name).once('value',
          function(snapshot) {
            resolve(snapshot.val());
          }, function (errorObject) {
            reject("The read failed: " + errorObject.code);
          });
      });
    } else {
      return new Promise<string>((resolve, reject) => {
        reject("You need to log in");
      });
    }
  }*/

  addItem(name : string,
          description : string,
          picture: string,
          type : string,
          max_borrow_duration: number,
          category: string) {
    console.log("current user");
    console.log(this.getCurrentUserId());
    console.log("----------- UPLOAD ITEM -------------");
    this.geolocation.getCurrentPosition().then((resp) =>
    {
      if (!picture) {
        picture = "something";
      }
      let item = {
        name: name,
        description: description,
        location: [resp.coords.longitude,resp.coords.latitude],
        owner_uid: this.getCurrentUserId(),
        picture: picture,
        date_posted: firebase.database.ServerValue.TIMESTAMP,
        type: type,
        borrower_uid: null,
        borrowTime: 0,
        returnTime: 0,
        max_borrow_duration: max_borrow_duration,
        category: category
      };
      firebase.database().ref().child('users/' + item.owner_uid + '/items/').push(item);
      console.log("AFTER PUSH");
    });
  }

  editItem(id: string, name : string, description : string, picture: string, type : string) {
    this.geolocation.getCurrentPosition().then((resp) =>
    {
      let item = {
        id: id,
        name: name,
        description: description,
        location: [resp.coords.longitude,resp.coords.latitude],
        owner_uid: this.getCurrentUserId(),
        picture: 'some/picture',
        date_posted: firebase.database.ServerValue.TIMESTAMP,
        type: type,
        borrower_uid: null,
        borrowTime: 0,
        returnTime: 0,
      };
      firebase.database().ref().child('users/' + item.owner_uid + '/items/' + id + '/').set(item);
      console.log("AFTER  EDIT");
    });

    // this.uploadImage(picture, "/pic", () => {
    //   console.log("IT IS DONE---------------------------");
    // }, (percent) => {
    //   console.log(percent + " --------------------------------");
    // }, (err) => {
    //   console.log("-----------------------___ERRORRRR" + err);
    // });
  }

  removeItem(id: string, owner_uid: string) {
    firebase.database().ref().child('users/' + owner_uid + '/items/' + id).remove();
  }

  borrowItem(id: string, owner_uid: string, max_borrow_time: number) {
    if (this.getCurrentUserId()) {
      firebase.database().ref()
        .child('users/' + owner_uid + '/' + id + 'borrower_uid')
        .set(this.getCurrentUserId());
      firebase.database().ref()
        .child('users/' + owner_uid + '/' + id + 'borrow_time')
        .set(firebase.database.ServerValue.TIMESTAMP);
      firebase.database().ref()
        .child('users/' + owner_uid + '/' + id + 'return_time')
        .set(parseInt(firebase.database.ServerValue.TIMESTAMP.toString())+max_borrow_time);
    }
  }

  returnItem(id: string, owner_uid: string) {
    if (this.getCurrentUserId()) {
      firebase.database().ref().child('users/' + owner_uid + '/' + id + 'borrower_uid').set(null);
      firebase.database().ref().child('users/' + owner_uid + '/' + id + 'borrow_time').set(0);
      firebase.database().ref().child('users/' + owner_uid + '/' + id + 'return_time').set(0);
    }
  }

  subscribeLoginEvent(callback: () => void) {
    firebase.auth().onAuthStateChanged(callback);
  }

  isLoggedin(): boolean {
    return firebase.auth().currentUser != null;
  }

  getAllLoggedInItems(): Promise<Item[]> {
    return new Promise<Item[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        function (snapshot) {
          let items = [];
          snapshot.forEach(function (user) {
            let user_items = user.val().items;

            // probably need this null check because of how val works
            if (user_items != null) {
              for (var index in user_items) {
                var item = user_items[index];
                item.id = index;
                items.push(item);
              }
            }
            return false;
          });
          resolve(items);
        }, () => {
          reject("Error in fetching users from the database!");
        });
    });
  }


  getAllItems(): Promise<Item[]> {
    return new Promise<Item[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        function (snapshot) {
          let items = [];
          snapshot.forEach(function (user) {
            let user_items = user.val().items;

            // probably need this null check because of how val works
            if (user_items != null) {
              for (var index in user_items) {
                var item = user_items[index];
                item.id = index;
                items.push(item);
              }
            }
            return false;
          });
          resolve(items);
        }, () => {
          reject("Error in fetching users from the database!");
        });
    });
  }

  private getBlobFromUrl(url: string, onComplete: (response) => void) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = () => {
      onComplete(xhr.response);
    };
    xhr.send();
  }

  public uploadImage(fileLocation: string, storageLocation: string,
                     onComplete = () => {},
                     onRunning = (percent) => {},
                     onError = (error) => {console.error(error)}
  ): any {
    var currentUpload = null;
    this.getBlobFromUrl(fileLocation, (data) => {
      currentUpload = firebase.storage()
        .ref(storageLocation)
        .put(data);
      console.log(currentUpload);
      currentUpload.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          let percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          onRunning(percent);
        },
        onError,
        onComplete
      );
    });
  }

  public addReview(user_id: string, rating: number, review: string) {
    let newReview = {
      user_id: user_id,
      review: review,
      rating: rating
    } as Review;

    let uid : string = this.getCurrentUserId();
    firebase.database().ref('/users/' + uid + '/reviews').push(newReview);
  }

}
