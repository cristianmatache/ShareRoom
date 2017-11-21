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
  addItems: string[] = ["addItemCard"];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public app: App, private db: Database) {}

  ionViewDidLoad() {
    this.db.getAllItems().then((items) => {
      this.items = items;
      this.filteredItems = items;

      this.filteredItems.unshift({
        id: "default0",
        name: "Add item",
        location: [],
        owner_uid: "",
        picture: "../../assets/images/add-item-dark.png",
        description: "",
        date_posted: -123,
        type: "New",
        borrower_uid : "",
        borrow_time: -123,
        return_time: 0,
        max_borrow_duration: 0,
        category: "",
        requests: [],
        borrow_readable_time: "",
        max_borrow_duration_readable_time: "",
        percentage_time: 0,
        owner: "",
        borrower : "",
      });
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

  getPostItemPage() {
    return this.navCtrl.push("PostItemPage");
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
