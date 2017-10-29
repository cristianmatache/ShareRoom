import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {User} from "../../models/user";
import {Database} from "../../providers/database";
import {ChatPage} from "../chat/chat";

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

  startChat() {
    this.navCtrl.push(ChatPage, {
      friendId: this.item.owner_uid
    })
  }
}
