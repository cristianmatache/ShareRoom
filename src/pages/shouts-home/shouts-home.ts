import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {Shout} from "../../models/shout";

/**
 * Generated class for the ShoutsHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shouts-home',
  templateUrl: 'shouts-home.html',
})
export class ShoutsHomePage {

  shouts: Shout[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.db.getAllShouts().then((shouts) => {
      this.shouts = shouts;
      this.shouts.unshift({
        name: "Add your shout",
        picture: "../../assets/images/add-item-dark.png",
        type: "New",
        location: [],
        shouter_uid: "",
        shouter: "",
        borrow_time: -123,
        max_borrow_duration: 0,
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoutsHomePage');
  }

  getDistanceTill(item) {
    return "500 meters";
  }

  // not really working for web app
  getNumberOfColumns() {
    var nrList = [];
    for (var i = 0; i < Math.floor(window.innerWidth / 150); i++) {
      nrList.push(i);
    }
    return nrList;
  }

  getPostItemPage() {
    return this.navCtrl.push("PostItemPage");
  }
}
