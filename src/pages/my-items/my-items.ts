import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import { Database } from "../../providers/database";
import {DisplayableBorrowedItem} from "../../models/displayable-borrowed-item";
import {Auth} from "../../providers/auth";

/**
 * Generated class for the MyItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-items',
  templateUrl: 'my-items.html',
})
export class MyItemsPage {

  MS_IN_A_DAY: number = 86400000;

  filteredItems: Item[] = [];
  itemsWithRequests: Item[] = [];
  itemsLoggedInUserLent: Item[] = [];
  myitems: string = "requests";

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database, private auth : Auth) {
  }

  someFunction = (items) => {
    const promises = items.map(async (eachItem) => {
      this.auth.getUserInfoById(eachItem.borrower_uid).then(
        (user) => {
          eachItem.borrower = user.display_name;
          eachItem.borrow_readable_time = new Date(eachItem.borrow_time).toDateString();
          eachItem.max_borrow_duration_readable_time = new Date(eachItem.max_borrow_duration).toDateString();

          // Add 1 day to the denominator since the end day is also part of the borrow time.
          // I.E. end day - beginning day + 1.
          eachItem.percentage_time = Math.floor(
            100
            * (Date.now() - eachItem.borrow_time)
            / (eachItem.max_borrow_duration - eachItem.borrow_time + this.MS_IN_A_DAY));
          return eachItem;
        }
      ).catch(console.error);
    });
    return Promise.all(promises);
  };

  ionViewDidLoad() {
    this.db.getAllLoggedInItems().then((items) => {
      this.filteredItems = items;
      this.itemsWithRequests = this.filteredItems.filter(item => item.requests);
      this.itemsLoggedInUserLent = items.filter(item => item.borrower_uid);
      console.log(this.someFunction(this.itemsLoggedInUserLent));
      //this.itemsLoggedInUserLent = this.someFunction(itemsWithBorrowers);
    });
    console.log('ionViewDidLoad MyItemsPage');
  }

  getNumberOfColumns() {
    var nrList = [];
    for (var i = 0; i < Math.floor(window.innerWidth / 150); i++) {
      nrList.push(i);
    }
    return nrList;
  }

  getNumberOfRequests(item) {
    return String(item.requests.length) + " requests";
  }

  getReceivedRequests(item) {
    console.log("ENTERED RECEIVED REQUESTS ------------------");
    return this.navCtrl.push("ReceivedRequestsPage", {item: item});
  }

  getDateFromTimestamp(timestamp) {
    return new Date(timestamp).toDateString();
  }

  receivedItemBack(item) {
    // console.log("STARTED TO REMOVE AN ITEM the item is ");
    // console.log(item);
    this.db.removeBorrower(item.owner_uid, item.id);
    this.navCtrl.push("MyItemsPage");
  }

  reviewOwner(item) {
    if (item.borrower_uid != this.auth.getCurrentUserId()) {
      this.navCtrl.push("AddReviewsPage", {"userToReviewUID": item.borrower_uid});
    }
  }

  chatWith(item) {
    this.navCtrl.push("ChatPage", {"friendId": item.borrower_uid});
  }

  redirectToEditItem(item) {
    this.navCtrl.push("ItemByUserPage", {"item": item});
  }

  goToOtherUsersPage(item) {
    if (item.borrower_uid != this.auth.getCurrentUserId()) {
      this.navCtrl.push("UserProfilePage", {"userId": item.borrower_uid});
    }
  }

  // goToOtherUsersPage(item) {
  //   // TO DO: change to users reviews page not add reviews page
  //   this.reviewOwner(item);
  // }

  // ionViewDidLoad() {
  //   this.db.getAllLoggedInItems().then((items) => {
  //     this.filteredItems = items;
  //     this.itemsWithRequests = this.filteredItems.filter(item => item.requests);
  //     for (var rawItem of items.filter(item => item.borrower_uid)) {
  //       var dispItem: DisplayableBorrowedItem = {
  //         name : rawItem.name,
  //         picture : rawItem.picture,
  //         description: rawItem.description,
  //         type: rawItem.type,
  //         category: rawItem.category,
  //
  //         owner : rawItem.owner_uid,
  //         borrower : rawItem.borrower_uid,
  //
  //         borrow_time : new Date(rawItem.borrow_time * 1000).toDateString(),
  //         max_borrow_duration : new Date(rawItem.max_borrow_duration * 1000).toDateString(),
  //         percentage_time : Math.floor(100 * (Date.now() / 1000 - rawItem.borrow_time) / (rawItem.max_borrow_duration - rawItem.borrow_time))
  //       };
  //
  //       this.db.getUserInfoById(rawItem.borrower_uid)
  //         .then((user) => {
  //           dispItem.borrower = user.display_name;
  //           //this.imagePath = user.profile_picture;
  //         })
  //         .catch(console.error);
  //
  //
  //
  //       // console.log(dispItem.name);
  //       // console.log("now " + Date.now());
  //       // console.log("sta " + rawItem.borrow_time);
  //       // console.log("fin " + rawItem.max_borrow_duration);
  //       // console.log(dispItem.percentage_time);
  //       // console.log("--------------- done with lent item ");
  //       this.itemsLoggedInUserLent.push(dispItem);
  //     }
  //   });
  //   console.log('ionViewDidLoad MyItemsPage');
  // }
}
