import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {Message} from "../../models/message";
import {Database} from "../../providers/database";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database) {
    database.login({email: "hello@google.com", password: "password"} as User).then((data) => {
      this.messages.push({
        text: "Hello",
        from: {email: "alex"} as User,
        at: new Date()
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  public sendMessage() {
    if (this.input == "") {
      return
    }
    this.messages.push({
      text: this.input,
      from: {email: "hello@google.com"} as User,
      at: new Date()
    });
    this.input = ""
  }

  public getBubbleClass(message: Message): String {
    return message.from.email === this.database.getCurrentUser().email ? "chat-bubble" +
      " chat-bubble-me" : "chat-bubble chat-bubble-other";
  }
}
