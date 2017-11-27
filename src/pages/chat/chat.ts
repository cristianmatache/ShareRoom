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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chat: Chat,
              public auth : Auth) {
    this.friendId = navParams.get("friendId");
    auth.getUserInfoById(this.friendId)
      .then((u) => {
        this.friend = u;
      })
      .catch(console.error);

    this.refresh(100);
    this.subscribeToNewChats();
  }

  ngOnDestroy() {
    this.chat.unsubscribeFromChat(this.friendId);
  }

  private subscribeToNewChats() {
    this.chat.subscribeToChat(this.friendId, (snap) => {
      this.refresh(1);
    })
  }

  public refresh(num) {
    this.chat.getFriendMessages(num, this.friendId)
      .then(messages => {
        messages.map(m => {
          if (this.messages.indexOf(m) < 0) {
            this.messages.push(m);
          }
        });
        this.messages.sort((a, b) => {
          if (a.timestamp === b.timestamp) {
            return 0;
          } else if (a.timestamp > b.timestamp) {
            return 1;
          } else {
            return -1;
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

  public getBubbleClass(message: Message): string {
    return message.from == this.auth.getCurrentUserId() ? "chat-bubble" +
      " chat-bubble-me" : "chat-bubble chat-bubble-other";
  }

}
