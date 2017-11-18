import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MapPage } from '../map/map';
import {Item, ItemType} from "../../models/item";
import { ItemPage } from "../item/item";
import { Database } from "../../providers/database";
import {ItemByUserPage} from "../item-by-user/item-by-user";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {

  items: Item[] = [];
  filteredItems: Item[] = [];
  searchQuery: string = "";

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public app: App, private db: Database) {}

  ionViewDidLoad() {
    this.db.getAllItems().then((items) => {
      this.items = items;
      this.filteredItems = items;
    });
  }

  onSearch(event) {
    this.filteredItems = this.items.filter((item) => {
      return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  onCancelSearch(event) {
    this.filteredItems = this.items;
  }

  changeToMap() {
    this.navCtrl.setRoot(MapPage);
  }

  showItem(item) {
    if (item.owner_uid == this.db.getCurrentUserId()) {
      this.app.getRootNav().push(ItemByUserPage, {item: item});
    } else {
      this.app.getRootNav().push(ItemPage, {item: item});
    }
  }

  getDistanceTill(item) {
    return "15miles";
  }

  // not really working for web app
  getNumberOfColumns() {
    var nrList = [];
    for (var i = 0; i < Math.floor(window.innerWidth / 150); i++) {
      nrList.push(i);
    }
    return nrList;
  }

}
