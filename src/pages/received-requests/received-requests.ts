import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";

/**
 * Generated class for the ReceivedRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-received-requests',
  templateUrl: 'received-requests.html',
})
export class ReceivedRequestsPage {

  item: Item;
  requests: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get("item");
    this.requests = this.item.requesters;//.filter(req => req);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivedRequestsPage');
  }

}
