import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../models/user";
import {Chat} from "../../providers/chat";

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  users: [User];

  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: Chat) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');
  }

  openChat(user) {
    this.navCtrl.push("ChatPage", {
      friendId: user.uid
    })
  }
}
