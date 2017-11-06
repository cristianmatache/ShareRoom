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

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public app: App, private db: Database) {}

  ionViewDidLoad() {
    this.db.getAllItems().then((items) => this.items = items);
    //this.refreshItems();
  }

  refreshItems() {
    this.items.push({
      id: "1",
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/bed.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.FREE,
      borrower_uid: null,
      borrow_time: 0,
      return_time: 0,
      max_borrow_duration: 604800000,
    }, {
      id: "2",
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/bicycle.JPG",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.SWAP,
      borrower_uid: null,
      borrow_time: 0,
      return_time: 0,
      max_borrow_duration: 604800000,
    }, {
      id: "3",
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/marty-avatar.png",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.SWAP,
      borrower_uid: null,
      borrow_time: 0,
      return_time: 0,
      max_borrow_duration: 604800000,
    }, {
      id: "4",
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/tv.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.SWAP,
      borrower_uid: null,
      borrow_time: 0,
      return_time: 0,
      max_borrow_duration: 604800000,
    }, {
      id: "5",
      name: "Bed",
      location: [-1, 1],
      owner_uid: this.db.getCurrentUserId(),
      picture: "../../assets/image/bed.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime(),
      type: ItemType.LOAN,
      borrower_uid: null,
      borrow_time: 0,
      return_time: 0,
      max_borrow_duration: 604800000,
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
