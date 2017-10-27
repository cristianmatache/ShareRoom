import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {Message} from "../../models/message";
import {Database} from "../../providers/database";
import {Chat} from "../../providers/chat";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  input: String = "";
  friendName: String = "Alex";
  messages: Message[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public chat: Chat) {
    database.login({email: "hello@google.com", password: "password"} as User).then((data) => {
    }).catch((err) => {
      console.error(err);
    });
  }

  public sendMessage() {
    if (this.input == "") {
      return
    }

    this.input = ""
  }

  public getBubbleClass(message: Message): String {
    return "";
  }
}
