import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MapPage } from '../map/map';
import {Item, ItemType} from "../../models/item";
import { ItemPage } from "../item/item";
import { Database } from "../../providers/database";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {

  items: Item[] = [];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public app: App, private db: Database) {}

  ionViewDidLoad() {
    this.refreshItems();
  }

  refreshItems() {
    this.items.push({
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/bed.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.FREE
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/bicycle.JPG",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.SWAP
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/marty-avatar.png",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.SWAP
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/tv.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.SWAP
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/bed.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.LOAN
    });
  }

  onSearch(event) {

  }

  onCancelSearch(event) {

  }

  changeToMap() {
    this.navCtrl.setRoot(MapPage);
  }

  showItem(item) {
    this.app.getRootNav().push(ItemPage, {item: item});
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
