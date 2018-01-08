import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { Message } from "../../models/message";
import { Database } from "../../providers/database";
import { Chat } from "../../providers/chat";
import {Auth} from "../../providers/auth";

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

  input: string = "";
  friendId: string;
  messages: Message[] = [];
  friend: User = {} as User;
  refreshNr = 1000;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chat: Chat,
              public auth : Auth) {
    this.friendId = navParams.get("friendId");
    this.auth.getUserInfoById(this.friendId)
      .then(value => {
        this.friend = value;
      });
    this.refresh(this.refreshNr);
    this.subscribeToNewChats();
  }

  ngOnDestroy() {
    this.chat.unsubscribeFromChat(this.friendId);
  }

  private subscribeToNewChats() {
    this.chat.subscribeToChat(this.friendId, (snap) => {
      this.refresh(this.refreshNr);
    })
  }

  public refresh(num) {
    this.chat.getFriendMessages(num, this.friendId)
      .then(messages => {
        messages.sort((a, b) => {
          if (a.timestamp === b.timestamp) {
            return 0;
          } else if (a.timestamp > b.timestamp) {
            return 1;
          } else {
            return -1;
          }
        });
        this.messages = [];
        messages.forEach((value, index) => {
          if (messages.length - index < num) {
            this.messages.push(value);
          }
        });
      })
      .catch(console.error);
  }

  public sendMessage() {
    if (this.input == "") {
      return
    }

    this.chat.sendMessage(this.input, this.friendId).then(msg => {
      this.messages.push(msg);
    }).catch(console.error);

    this.input = ""
  }

  public isOther(message: Message): boolean {
    return message.from !== this.auth.getCurrentUserId()
  }
}
