import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Item} from "../../models/item";
import {User} from "../../models/user";
import {Database} from "../../providers/database";
import {ChatPage} from "../chat/chat";
import {EditItemPage} from "../edit-item/edit-item";
import {HomePage} from "../home/home";
import {Auth} from "../../providers/auth";

/**
 * Generated class for the ItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-by-user',
  templateUrl: 'item-by-user.html',
})
export class ItemByUserPage {

  item: Item = {} as Item;
  user: User = {} as User;

  /* For test purpose */
  today: string;
  fromDate: string;
  toDate: string;
  maxSelectableDate: string;
  /* For test purpose */

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: Database,
              private auth : Auth) {
    this.item = navParams.get("item");

    /* For test purpose */
    this.today = new Date().toISOString();
    this.fromDate = new Date().toISOString();
    this.toDate = new Date().toISOString();
    this.maxSelectableDate = new Date(2018,11,30).toISOString();
    /* For test purpose */

    this.auth.getUserInfoById(this.item.owner_uid)
      .then((user) => {
        this.user = user;
      })
      .catch(console.error);
  }

  getPicture() {
    return this.item.picture ? this.item.picture : "";
  }

  removeItem() {
    this.database.removeItem(this.item.id, this.auth.getCurrentUserId());
    this.navCtrl.setRoot(HomePage);
  }

  editItem() {
    this.navCtrl.push(EditItemPage, {item: this.item});
  }

  requestItem() {
    console.log("fromDate timestamp " + Date.parse(this.fromDate));
    console.log("toDate timestamp " + Date.parse(this.toDate));
    //this.database.requestItem(this.item.id, this.item.owner_uid, 1511269416, 1514937600);
    this.database.requestItemInNameOfUserId("PhMUkbbHHRXFy9XqmeYxHN3GYx13",this.item.id, this.item.owner_uid, Date.parse(this.fromDate)/1000, Date.parse(this.toDate)/1000);
  }
}
