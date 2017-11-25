import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Database} from "../../providers/database";
import {Item} from "../../models/item";

/**
 * Generated class for the UserItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-items',
  templateUrl: 'user-items.html',
})
export class UserItemsPage {

  items: Item[] = [];
  userId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.userId = navParams.get("userId");
  }

  ionViewDidLoad() {
    this.db.getItemsForUser(this.userId).then((items) => {
      this.items = items;
    });
    console.log('ionViewDidLoad UserItemsPage');
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

  getItemPage(item) {
    this.navCtrl.push("ItemPage", {"item": item});
  }

}
