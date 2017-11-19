import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
  }

  ionViewDidLoad() {
    this.db.getAllItems().then((items) => {
      this.itemsLoggedInUserRequested = items.filter(item => {
        if (item.requesters) {
          return item.requesters.indexOf(this.db.getCurrentUserId()) > -1;
        } else {
          return false;
        }
      });
      console.log("items i requested");
      for (var i of this.itemsLoggedInUserRequested) {
        console.log(i.name);
      }
      this.itemsLoggedInUserBorrowed = items.filter(item => {
        if (item.borrower_uid) {
          return item.borrower_uid === this.db.getCurrentUserId();
        } else {
          return false;
        }
      });
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
    return String(item.requesters.length) + " requests";
  }

}
