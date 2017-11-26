import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {User} from "../../models/user";
import {Database} from "../../providers/database";
import {ChatPage} from "../chat/chat";
import {AddReviewsPage} from "../add-reviews/add-reviews";

/**
 * Generated class for the ItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {

  item: Item = {} as Item;
  user: User = {} as User;

  today: string;
  fromDate: string;
  toDate: string;
  maxSelectableDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: Database) {
    this.item = navParams.get("item");

    this.today = new Date().toISOString();
    this.fromDate = new Date().toISOString();
    this.toDate = new Date().toISOString();
    this.maxSelectableDate = new Date(2018,11,30).toISOString();

    this.database.getUserInfoById(this.item.owner_uid)
      .then((user) => {
        this.user = user;
      })
      .catch(console.error);
  }

  getPicture() {
    return this.item.picture ? this.item.picture : "";
  }

  requestItem() {
    this.database.requestItem(this.item.id, this.item.owner_uid, Date.parse(this.fromDate)/1000, Date.parse(this.toDate)/1000);
    this.navCtrl.push("BorrowedItemsPage");
  }

  startChat() {
    this.navCtrl.push("ChatPage", {"friendId": this.item.owner_uid});
  }

  goToOtherUsersPage(userId) {
    if (userId != this.database.getCurrentUserId()) {
      this.navCtrl.push("UserProfilePage", {"userId": userId});
    }
  }

  reviewOwner() {
    this.navCtrl.push("AddReviewsPage");
  }
}
