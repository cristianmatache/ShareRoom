import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {DisplayableBorrowedItem} from "../../models/displayable-borrowed-item";

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

  borrowitems: string = "requests";
  itemsLoggedInUserRequested: Item[] = [];
  itemsLoggedInUserBorrowed: Item[] = [];
  currentUserId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.currentUserId = this.db.getCurrentUserId();
  }

  someFunction = (items) => {
    const promises = items.map(async (eachItem) => {
      console.log("someFunctioning*");
      this.db.getUserInfoById(eachItem.owner_uid).then(
        (user) => {
          eachItem.owner = user.display_name;
          eachItem.borrow_readable_time = new Date(eachItem.borrow_time * 1000).toDateString();
          eachItem.max_borrow_duration_readable_time = new Date(eachItem.max_borrow_duration * 1000).toDateString();
          eachItem.percentage_time = Math.floor(100 * (Date.now() / 1000 - eachItem.borrow_time) / (eachItem.max_borrow_duration - eachItem.borrow_time));
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
            if (request.requester_uid === this.currentUserId) {
              return true;
            }
          }
        }
        return false;
      });

      this.itemsLoggedInUserBorrowed = items.filter(item => {
        console.log("FILTERING");
        if (item.borrower_uid) {
          return item.borrower_uid === this.currentUserId;
        } else {
          return false;
        }
      });
      console.log("BEFORE ADDING THE OWNER ITEMS LIU BORROWED");
      //console.log(this.itemsLoggedInUserBorrowed);

      this.someFunction(this.itemsLoggedInUserBorrowed);
      console.log(this.itemsLoggedInUserBorrowed);
    });
    console.log('ionViewDidLoad BorrowedItemsPage');
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
    return (new Date(timestamp * 1000)).toDateString();
  }

  returnedItemToOwner(item) {
    this.db.removeBorrower(item.owner_uid, item.id);
    this.navCtrl.push("BorrowedItemsPage");
  }

  reviewOwner(item) {
    this.navCtrl.push("AddReviewsPage", {"userToReviewUID":item.owner_uid});
  }

  goToOtherUsersPage(item) {
    // TO DO: change to users reviews page not add reviews page
    this.reviewOwner(item);
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
