import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import { Database } from "../../providers/database";
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

  filteredItems: Item[] = [];
  itemsWithRequests: Item[] = [];
  itemsLoggedInUserBorrowed: Item[] = [];
  myitems: string = "requests";

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
  }

  ionViewDidLoad() {
    this.db.getAllLoggedInItems().then((items) => {
      this.filteredItems = items;
      this.itemsWithRequests = this.filteredItems.filter(item => item.requesters);
    });

    this.db.getAllItems().then(items => {
      this.itemsLoggedInUserBorrowed = items.filter(item => {
        if (item.borrower_uid) {
          return item.borrower_uid === this.db.getCurrentUserId();
        } else {
          return false;
        }
      });
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

  getDistanceTill(item) {
    return "15 miles";
  }

  getNumberOfRequests(item) {
    return String(item.requesters.length) + " requests";
  }
}
