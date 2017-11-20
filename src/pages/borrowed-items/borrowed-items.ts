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
  itemsLoggedInUserBorrowed: DisplayableBorrowedItem[] = [];
  currentUserId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.currentUserId = this.db.getCurrentUserId();
  }

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
      // console.log("items i requested");
      // for (var i of this.itemsLoggedInUserRequested) {
      //   console.log(i.name);
      // }

      var rawItems = items.filter(item => {
        if (item.borrower_uid) {
          return item.borrower_uid === this.db.getCurrentUserId();
        } else {
          return false;
        }
      });

      for (var rawItem of rawItems) {
        var dispItem: DisplayableBorrowedItem = {
          name : rawItem.name,
          picture : rawItem.picture,
          description: rawItem.description,
          type: rawItem.type,
          category: rawItem.category,

          owner : rawItem.owner_uid,
          borrower : rawItem.borrower_uid,

          borrow_time : new Date(rawItem.borrow_time * 1000).toDateString(),
          max_borrow_duration : new Date(rawItem.max_borrow_duration * 1000).toDateString(),
          percentage_time : Math.floor(100 * (Date.now() / 1000 - rawItem.borrow_time) / (rawItem.max_borrow_duration - rawItem.borrow_time))
        };

        this.db.getUserInfoById(rawItem.borrower_uid)
          .then((user) => {
            dispItem.borrower = user.display_name;
            //this.imagePath = user.profile_picture;
          })
          .catch(console.error);

        this.itemsLoggedInUserBorrowed.push(dispItem);
      }
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

}
