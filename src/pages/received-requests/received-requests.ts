import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {Request} from "../../models/request";
import {Auth} from "../../providers/auth";

/**
 * Generated class for the ReceivedRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-received-requests',
  templateUrl: 'received-requests.html',
})
export class ReceivedRequestsPage {

  item: Item;
  requests: Request[] = [];

  maxDate:number = 0;
  minDate:number = 8640000000000;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database, private auth : Auth) {
    this.item = navParams.get("item");
    this.maxDate = 0;
    this.minDate = 8640000000000;
    for (var r of this.item.requests) {
      if (!r) {
        continue;
      }
      if (r.borrow_time < this.minDate) {
        this.minDate = r.borrow_time;
      }
      if (r.max_borrow_duration > this.maxDate) {
        this.maxDate = r.max_borrow_duration;
      }
    }
    this.requests = this.item.requests;
  }

  ionViewDidLoad() {
    console.log(this.someFunction(this.requests));
  }

  someFunction = (myArray) => {
    const promises = myArray.map(async (myValue) => {

      if (myValue) {
        console.log(myValue);
        this.auth.getUserInfoById(myValue.requester_uid).then(
          (user) => {
            myValue.requester_name = user.display_name;
            myValue.requester_picture = user.profile_picture;
            return myValue;
          }
        ).catch(console.error);
      }

    });
    return Promise.all(promises);
  };

  getTakePerc (reqTakeTime) {
    return Math.ceil(100 * ((reqTakeTime - this.minDate) / (this.maxDate - this.minDate)));
  }

  getRetPerc (reqRetTime) {
    return Math.ceil(100 * ((reqRetTime - this.minDate) / (this.maxDate - this.minDate)));
  }

  getDateFromTimestamp(timestamp) {
    return new Date(timestamp).toDateString();
  }

  moveToLent(request) {
    this.db.addBorrow(request.owner_uid, request.requester_uid, request.item_id, request.borrow_time, request.max_borrow_duration);
    this.removeThisRequest(request.requester_uid, request.item_id);
    this.navCtrl.push("MyItemsPage");
    //this.navCtrl.push("ProfilePage"); // should be lent page;
  }

  removeThisRequest(requester_uid, request_item_id) {
    console.log(this.db.removeItemRequestsFrom(requester_uid, this.auth.getCurrentUserId(), request_item_id));
    this.navCtrl.push("MyItemsPage");
    //this.navCtrl.push("ProfilePage");
  }

  chatWith(requester_uid) {
    this.navCtrl.push("ChatPage", {"friendId": requester_uid});
  }

  goToOtherUsersPage(userId) {
    if (userId != this.auth.getCurrentUserId()) {
      this.navCtrl.push("UserProfilePage", {"userId": userId});
    }
  }

  // goToOtherUsersPage(reviewer_id) {
  //   // TO DO: change to users reviews page not add reviews page
  //   if (reviewer_id != this.db.getCurrentUserId()) {
  //     this.navCtrl.push("AddReviewsPage", {"userToReviewUID": reviewer_id});
  //   }
  // }
}
