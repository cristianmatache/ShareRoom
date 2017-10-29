import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MapPage } from '../map/map';
import {Item} from "../../models/item";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {

  items: Item[] = [];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
    this.items.push({
      name: "Bed",
      location: [-1, 1],
      owner_uid: "owner",
      picture: "../../assets/image/bed.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime()
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: "owner",
      picture: "../../assets/image/bicycle.JPG",
      description: "This is a bed",
      date_posted: new Date().getTime()
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: "owner",
      picture: "../../assets/image/marty-avatar.png",
      description: "This is a bed",
      date_posted: new Date().getTime()
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: "owner",
      picture: "../../assets/image/tv.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime()
    }, {
      name: "Bed",
      location: [-1, 1],
      owner_uid: "owner",
      picture: "../../assets/image/bed.jpg",
      description: "This is a bed",
      date_posted: new Date().getTime()
    });
  }

  ionViewDidLoad() {
    this.refreshItems();
  }

  refreshItems() {
  }

  changeToMap() {
    this.navCtrl.setRoot(MapPage);
  }

  getDistanceTill(item) {
    return "15miles";
  }

  getNumberOfColumns() {
    var nrList = [];
    for (var i = 0; i < Math.floor(window.innerWidth / 360); i++) {
      nrList.push(i);
    }
    return nrList;
  }

}
