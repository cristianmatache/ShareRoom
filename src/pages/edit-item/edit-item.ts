import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";

/**
 * Generated class for the EditItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {

  item: Item = {} as Item;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database : Database) {
    this.item = navParams.get("item");
  }

  editItem() {
    this.database.editItem(this.item.id, this.item.name, this.item.description, this.item.picture, this.item.type);
    this.navCtrl.pop();
  }

}
