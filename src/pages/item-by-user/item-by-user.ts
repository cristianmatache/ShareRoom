import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {User} from "../../models/user";
import {Database} from "../../providers/database";
import {ChatPage} from "../chat/chat";
import {EditItemPage} from "../edit-item/edit-item";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: Database) {
    this.item = navParams.get("item");

    this.database.getUserInfoById(this.item.owner_uid)
      .then((user) => {
        this.user = user;
      })
      .catch(console.error);
  }

  getPicture() {
    return this.item.picture ? this.item.picture : "";
  }

  removeItem() {
    this.database.removeItem(this.item.id, this.database.getCurrentUserId());
  }

  editItem() {
    this.navCtrl.push(EditItemPage, {item: this.item});
  }

  requestItem() {
    this.database.requestItemInNameOfUserId("PhMUkbbHHRXFy9XqmeYxHN3GYx13",this.item.id, this.item.owner_uid, 1511269416, 1514937600);
  }
}
