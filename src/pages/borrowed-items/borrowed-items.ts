import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {DisplayableBorrowedItem} from "../../models/displayable-borrowed-item";
import {Auth} from "../../providers/auth";

/**
 * Generated class for the BorrowedItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-borrowed-items',
  templateUrl: 'borrowed-items.html',
})
export class BorrowedItemsPage {

  MS_IN_A_DAY: number = 86400000;

  borrowitems: string = "requests";
  itemsLoggedInUserRequested: Item[] = [];
  itemsLoggedInUserBorrowed: Item[] = [];
  currentUserId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database, private auth : Auth) {
    this.currentUserId = this.auth.getCurrentUserId();
  }

  someFunction = (items) => {
    const promises = items.map(async (eachItem) => {
      this.auth.getUserInfoById(eachItem.owner_uid).then(
        (user) => {
          eachItem.owner = user.display_name;
          console.log(eachItem.borrow_time);
          eachItem.borrow_readable_time = new Date(eachItem.borrow_time).toDateString();
          eachItem.max_borrow_duration_readable_time = new Date(eachItem.max_borrow_duration).toDateString();

          // Add 1 day to the denominator since the end day is also part of the borrow time.
          // I.E. end day - beginning day + 1.
          eachItem.percentage_time = Math.floor(100
            * (Date.now() - eachItem.borrow_time) < 0 ? 0 : (Date.now() - eachItem.borrow_time)
            / (eachItem.max_borrow_duration - eachItem.borrow_time + this.MS_IN_A_DAY));
          return eachItem;
        }
      ).catch(console.error);
    });
    return Promise.all(promises);
  };

  someFunction2 = (items) => {
    const promises = items.map(async (eachItem) => {
      this.auth.getUserInfoById(eachItem.owner_uid).then(
        (user) => {
          eachItem.owner = user.display_name;
          return eachItem;
        }
      ).catch(console.error);
    });
    return Promise.all(promises);
  };

  ionViewDidLoad() {
    this.db.getAllItems().then((items) => {
      this.itemsLoggedInUserRequested = items.filter(item => {
        if (item.requests) {
          for (let request of item.requests) {
            if (typeof request != 'undefined' && request.requester_uid === this.currentUserId) {
              return true;
            }
          }
        }
        return false;
      });


      this.itemsLoggedInUserRequested = this.itemsLoggedInUserRequested.map( (item) => {
        if (item.requests) {
          for (let request of item.requests) {
            item.borrow_readable_time = this.getDateFromTimestamp(request.borrow_time);
            item.max_borrow_duration_readable_time = this.getDateFromTimestamp(request.max_borrow_duration);
          }
          return item;
        }
      });

      this.itemsLoggedInUserBorrowed = items.filter(item => {
        console.log("FILTERING");
        if (item.borrower_uid) {
          return item.borrower_uid === this.currentUserId;
        } else {
          return false;
        }
      });

      this.someFunction(this.itemsLoggedInUserBorrowed);
      this.someFunction2(this.itemsLoggedInUserRequested);
      console.log(this.itemsLoggedInUserBorrowed);
      console.log(this.itemsLoggedInUserRequested);
    });
  }

  getNumberOfColumns() {
    var nrList = [];
    for (var i = 0; i < Math.floor(window.innerWidth / 150); i++) {
      nrList.push(i);
    }
    return nrList;
  }

  getDistanceTill(item) {
    return "15 miles";
  }

  getNumberOfRequests(item) {
    return String(item.requests.length) + " requests";
  }

  getDateFromTimestamp(timestamp) {
    return new Date(timestamp).toDateString();
  }

  returnedItemToOwner(item) {
    this.db.setBorrowerClaimedToReturn(item.owner_uid, item.id, 1);
    //this.db.removeBorrower(item.owner_uid, item.id);
    this.navCtrl.push("BorrowedItemsPage");
  }

  cancelReturnClaim(item) {
    this.db.setBorrowerClaimedToReturn(item.owner_uid, item.id, 0);
    //this.db.removeBorrower(item.owner_uid, item.id);
    this.navCtrl.push("BorrowedItemsPage");
  }

  reviewOwner(item) {
    if (item.owner_uid != this.auth.getCurrentUserId()) {
      this.navCtrl.push("AddReviewsPage", {"userToReviewUID": item.owner_uid});
    }
  }

  goToOtherUsersPage(item) {
    if (item.owner_uid != this.auth.getCurrentUserId()) {
      this.navCtrl.push("UserProfilePage", {"userId": item.owner_uid});
    }
  }

  chatWithOwner(ownerId) {
    this.navCtrl.push("ChatPage", {"friendId": ownerId});
  }

  // goToOtherUsersPage(item) {
  //   // TO DO: change to users reviews page not add reviews page
  //   this.reviewOwner(item);
  // }

  removeThisRequest(owner_uid, request_item_id) {
    this.db.removeItemRequestsFrom(this.auth.getCurrentUserId(), owner_uid, request_item_id);
    this.navCtrl.push("BorrowedItemsPage");
    //this.navCtrl.push("ProfilePage");
  }
}


// for (var rawItem of rawItems) {
//   var dispItem: DisplayableBorrowedItem = {
//     name : rawItem.name,
//     picture : rawItem.picture,
//     description: rawItem.description,
//     type: rawItem.type,
//     category: rawItem.category,
//
//     owner : rawItem.owner_uid,
//     borrower : rawItem.borrower_uid,
//
//     borrow_time : new Date(rawItem.borrow_time * 1000).toDateString(),
//     max_borrow_duration : new Date(rawItem.max_borrow_duration * 1000).toDateString(),
//     percentage_time : Math.floor(100 * (Date.now() / 1000 - rawItem.borrow_time) / (rawItem.max_borrow_duration - rawItem.borrow_time))
//   };
//
//   this.db.getUserInfoById(rawItem.borrower_uid)
//     .then((user) => {
//       dispItem.borrower = user.display_name;
//       //this.imagePath = user.profile_picture;
//     })
//     .catch(console.error);
//
//   this.itemsLoggedInUserBorrowed.push(dispItem);
// }
