import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Database} from "../../providers/database";
import {Shout} from "../../models/shout";
import {ShoutsHomePage} from "../shouts-home/shouts-home";

/**
 * Generated class for the AddShoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-shout',
  templateUrl: 'add-shout.html',
})
export class AddShoutPage {

  shout = {} as Shout;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: Database) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddShoutPage');
  }

  addShout() {
    console.log("shout picture " + this.shout.picture);
    if (this.shout.picture == undefined) {
      this.shout.picture = "https://files.itemku.com/images/gacha/gacha-icon.png";
    }
    if (this.shout.name != undefined) {
      this.database.addShout(this.shout.name, this.shout.type, this.shout.picture);
      //window.location.reload();
      this.navCtrl.setRoot(ShoutsHomePage);
    }
  }

}
