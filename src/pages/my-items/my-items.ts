import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import { Database } from "../../providers/database";
import {DisplayableBorrowedItem} from "../../models/displayable-borrowed-item";

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
  itemsLoggedInUserLent: DisplayableBorrowedItem[] = [];
  myitems: string = "requests";

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
  }

  ionViewDidLoad() {
    this.db.getAllLoggedInItems().then((items) => {
      this.filteredItems = items;
      this.itemsWithRequests = this.filteredItems.filter(item => item.requesters);
      for (var rawItem of items.filter(item => item.borrower_uid)) {
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

        console.log("---------------");
        console.log(dispItem.name);
        console.log("now " + Date.now());
        console.log("sta " + rawItem.borrow_time);
        console.log("fin " + rawItem.max_borrow_duration);
        console.log(dispItem.percentage_time);
        this.itemsLoggedInUserLent.push(dispItem);
      }
    });

    // console.log("*******************");
    // console.log(this.itemsLoggedInUserLent);
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

  getReceivedRequests(item) {
    return this.navCtrl.push("ReceivedRequestsPage", {item: item});
  }
}
