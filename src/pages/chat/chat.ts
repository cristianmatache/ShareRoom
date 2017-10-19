import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {Message} from "../../models/message";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public sendMessage() {
    if (this.input == "") {
      return
    }
    this.messages.push({
      text: this.input,
      from: {email: "bart", password: "acs"} as User,
      at: new Date()
    });
    this.input = ""
  }

  public getBubbleClass(message: Message): String {
    return message.from == message.from ? "chat-bubble chat-bubble-me" : "chat-bubble chat-bubble-other";
  }
}
