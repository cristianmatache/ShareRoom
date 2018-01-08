import {User} from '../models/user';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Platform} from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import {Item} from "../models/item";
import { Geolocation } from '@ionic-native/geolocation';
import {Review} from "../models/review";
import {Injectable} from "@angular/core";
import {Shout} from "../models/shout";
import {Auth} from "./auth";


@Injectable()
export class Database {

  constructor(private afAuth: AngularFireAuth,
              private fb: Facebook, private platform: Platform,
              private geolocation : Geolocation, private auth : Auth) {
  }

  addShout(name: string, type: string, picture: string): Promise<any> {
    let p1: Promise<any> = firebase.database().ref('/users/' + this.auth.getCurrentUserId() + '/shout/name').set(name);

    let p2: Promise<any>  = firebase.database().ref('/users/' + this.auth.getCurrentUserId() + '/shout/type').set(type);
    let p3: Promise<any>  = firebase.database().ref('/users/' + this.auth.getCurrentUserId() + '/shout/picture').set(picture);

    let p4: Promise<any> = this.geolocation.getCurrentPosition().then(
      (resp) => {
        firebase.database().ref('/users/' + this.auth.getCurrentUserId() + '/shout/location').set([resp.coords.longitude, resp.coords.latitude]);
      },
      () => {
        firebase.database().ref('/users/' + this.auth.getCurrentUserId() + '/shout/location').set([0, 0]);
      }
    )
    return Promise.all([p1, p2, p3, p4]);
  }

  async addItem(name : string,
          description : string,
          picture: string,
          type : string,
          max_borrow_duration: number,
          category: string) : Promise<any> {
    let resp = await this.geolocation.getCurrentPosition();

    if (!picture) {
      picture = "no_picture";
    }

    let item = {
      name: name,
      description: description,
      location: [resp.coords.longitude,resp.coords.latitude],
      owner_uid: this.auth.getCurrentUserId(),
      picture: picture,
      date_posted: Database.standardizeDateNumber(Date.now()),
      type: type,
      borrower_uid: null,
      max_borrow_duration: max_borrow_duration,
      category: category
    };

    return firebase.database().ref().child('users/' + item.owner_uid + '/items/').push(item);
  }

  editItem(id: string, name : string, description : string, picture: string, type : string) {
    this.geolocation.getCurrentPosition().then((resp) =>
    {
      let item = {
        id: id,
        name: name,
        description: description,
        location: [resp.coords.longitude,resp.coords.latitude],
        owner_uid: this.auth.getCurrentUserId(),
        picture: 'some/picture',
        date_posted: Database.standardizeDateNumber(Date.now()),
        type: type,
        borrower_uid: null,
      };
      firebase.database().ref().child('users/' + item.owner_uid + '/items/' + id + '/').set(item);
    });
  }

  removeItem(id: string, owner_uid: string) {
    firebase.database().ref().child('users/' + owner_uid + '/items/' + id).remove();
  }

  removeLoggedInUserShout() {
    console.log("REMOVING --- " + 'users/' + this.auth.getCurrentUserId() + '/shout/');
    firebase.database().ref().child('users/' + this.auth.getCurrentUserId() + '/shout/').remove()
  }

  removeItemRequestsFrom(requester_uid: string, owner_uid: string, item_id: string) : Promise<string[]> {
    return new Promise<string[]>( (resolve, reject) => {
      firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/requests').once(
        'value',
        (snapshot) => {
          let reqs_keys = [];
          snapshot.forEach( (request) => {
            if (request.val().requester_uid === requester_uid) {
              reqs_keys.push(request.key);
              firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id +'/requests/' + request.key).remove();
            }
            return false;
          });
          resolve(reqs_keys);
        },
        (x) => {reject("Error finding requester in the requests list of this item")}
      )
    })
  }

  borrowItem(id: string, owner_uid: string, max_borrow_time: number) {
    if (this.auth.getCurrentUserId()) {
      firebase.database().ref()
        .child('users/' + owner_uid + '/' + id + 'borrower_uid')
        .set(this.auth.getCurrentUserId());
      firebase.database().ref()
        .child('users/' + owner_uid + '/' + id + 'borrow_time')
        .set(firebase.database.ServerValue.TIMESTAMP);
      firebase.database().ref()
        .child('users/' + owner_uid + '/' + id + 'return_time')
        .set(parseInt(firebase.database.ServerValue.TIMESTAMP.toString())+max_borrow_time);
    }
  }


  addBorrow(owner_uid: string, requester_uid: string, item_id: string, borrow_time: string, max_borrow_duration: string) {
    firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/borrow_time').set(borrow_time);
    firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/max_borrow_duration').set(max_borrow_duration);
    firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/borrower_uid').set(requester_uid);
  }

  removeBorrower(owner_uid: string, item_id:string) {
    this.setBorrowerClaimedToReturn(owner_uid, item_id, 0);
    firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/borrower_uid').remove();
  }

  setBorrowerClaimedToReturn(owner_uid: string, item_id: string, value: number) {
    firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/borrower_claimed_to_return').set(value);
  }

  requestItem(item_id: string, owner_uid: string, borrow_time: number, max_borrow_duration: number) {
    // THIS BRINGS RACE CONDITIONS -------------> WE ASSUME NO 2 PEOPLE WILL REQUEST AN ITEM AT THE SAME TIME :)
    // IF WE WANT TO AVOID THIS WE CHANGED THE IMPLEMENTATION FROM [{}] TO {{}}
    // TODO
    if (this.auth.getCurrentUserId()) {

      let req = {
        max_borrow_duration: max_borrow_duration,
        borrow_time: borrow_time,
        item_id: item_id,
        requester_uid: this.auth.getCurrentUserId(),
        owner_uid: owner_uid,
      };

      firebase.database().ref('users/' + owner_uid + '/items/' + item_id).once(
        'value',
        function (snapshot) {
          if (snapshot.hasChild("requests")) {
            let reqs = snapshot.val().requests;
            reqs.push(req);
            firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/requests/').set(reqs);
          } else {
            firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/requests/').set([req]);
          }
        }, () => {});
    }
  }


  requestItemInNameOfUserId(requester_uid:string, item_id: string, owner_uid: string, borrow_time: number, max_borrow_duration: number) {
    // THIS BRINGS RACE CONDITIONS -------------> WE ASSUME NO 2 PEOPLE WILL REQUEST AN ITEM AT THE SAME TIME :)
    // IF WE WANT TO AVOID THIS WE CHANGED THE IMPLEMENTATION FROM [{}] TO {{}}
    // TODO
    if (this.auth.getCurrentUserId()) {
      let req = {
        max_borrow_duration: max_borrow_duration,
        borrow_time: borrow_time,
        item_id: item_id,
        requester_uid: requester_uid,
        owner_uid: owner_uid,
      };

      firebase.database().ref('users/' + owner_uid + '/items/' + item_id).once(
        'value',
        function (snapshot) {
          if (snapshot.hasChild("requests")) {
            let reqs = snapshot.val().requests;
            reqs.push(req);
            firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/requests/').set(reqs);
          } else {
            firebase.database().ref().child('users/' + owner_uid + '/items/' + item_id + '/requests/').set([req]);
          }
        }, () => {});
    }
  }

  returnItem(id: string, owner_uid: string) {
    if (this.auth.getCurrentUserId()) {
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

  getAllShouts(): Promise<Shout[]> {
    return new Promise<Shout[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        (snapshot) => {
          let shouts = [];
          snapshot.forEach((user) => {
            let newShout = user.val().shout;
            if (newShout) {
              newShout.shouter_uid = user.key;
              shouts.push(newShout);
            }
            return false;
          });
          resolve(shouts);
        },
        () => {reject("Error in fetching users in shouts from the database!");}
      );
    });
  }

  getAllLoggedInItems(): Promise<Item[]> {
    return new Promise<Item[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        function (snapshot) {
          let items = [];

          snapshot.forEach(function (user) {
            if (firebase.auth().currentUser.uid === user.key) {
              let user_items = user.val().items;
              // probably need this null check because of how val works
              if (user_items != null) {
                for (var index in user_items) {
                  var item = user_items[index];
                  item.id = index;
                  items.push(item);
                }
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

  getItemsForUser(userId : string): Promise<Item[]> {
    return new Promise<Item[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        function (snapshot) {
          let items = [];

          snapshot.forEach(function (user) {
            if (userId === user.key) {
              let user_items = user.val().items;
              // probably need this null check because of how val works
              if (user_items != null) {
                for (var index in user_items) {
                  var item = user_items[index];
                  item.id = index;
                  items.push(item);
                }
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

  getAllLoggedInReviews(): Promise<Review[]> {
    //return this.getAllReviewsOfUID(firebase.auth().currentUser.uid);
    return new Promise<Review[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        function (snapshot) {
          let reviews = [];
          snapshot.forEach(function (user) {
            if (firebase.auth().currentUser.uid === user.key) {
              let user_reviews = user.val().reviews;
              // probably need this null check because of how val works
              if (user_reviews != null) {
                for (var index in user_reviews) {
                  var review = user_reviews[index];
                  review.id = index;
                  reviews.push(review);
                }
              }
            }
            return false;
          });

          resolve(reviews);
        }, () => {
          reject("Error in fetching users from the database!");
        });
    });
  }

  getAllReviewsOfUID(user_id: string): Promise<Review[]> {
    return new Promise<Review[]>((resolve, reject) => {
      firebase.database().ref('users/').once(
        'value',
        function (snapshot) {
          let reviews = [];
          snapshot.forEach(function (user) {
            if (user_id === user.key) {
              let user_reviews = user.val().reviews;
              // probably need this null check because of how val works
              if (user_reviews != null) {
                for (var index in user_reviews) {
                  var review = user_reviews[index];
                  review.id = index;
                  reviews.push(review);
                }
              }
            }
            return false;
          });

          resolve(reviews);
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

  public addReview(reviewer_id: string, rating: number, review: string, title: string, uid: string) {
    let newReview = {
      user_id: reviewer_id,
      review: review,
      rating: rating,
      title: title
    } as Review;

    firebase.database().ref('/users/' + uid + '/reviews').push(newReview);
  }

  public getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // Rounds a Date object to millisecond 0 of the day it was created.
  // TODO: Probably shouldn't be here, but in a separate static class, idc.
  public static standardizeDate(date: Date): Date {
    console.log("INITIAL DATE: " + date.toDateString());
    date.setUTCHours(0, 0, 0, 0);
    console.log("INITIAL DATE4: " + date.toDateString());
    console.log(date.getTimezoneOffset());
    return date;
  }

  public static standardizeDateNumber(number: number): number {
    let date: Date = new Date(number);
    Database.standardizeDate(date);
    return date.getTime();
  }

}
