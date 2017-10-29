import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Events } from 'ionic-angular';
import { Message } from '../models/message';

@Injectable()
export class Chat {

  private databaseChats = firebase.database().ref('/chats');

  constructor(public events: Events) {

  }

  sendMessage(msg : string, uid2: string) : Promise<Message> {
    if (uid2) {
      let uid1 : string = firebase.auth().currentUser.uid;
      var path = this.getChatPath(uid1, uid2);

      return new Promise((resolve) => {
        let message = {
          text: msg,
          from: uid1,
          to: uid2,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        this.databaseChats.child(path).push(message).then(() => {
          resolve(message);
        });
      });
    } else {
      return new Promise<Message>((resolve, reject) => {
        reject("uid2 was not defined");
      });
    }
  }

  getFriendMessages(num_of_messages : number, friend_uid : string) : Promise<Array<Message>> {
    let temp;
    let messages : Array<Message> = [];
    let uid1 : string = firebase.auth().currentUser.uid;
    let path = this.getChatPath(uid1, friend_uid);

    return new Promise<Array<Message>>((resolve, reject) => {
      this.databaseChats.child(path).once('value', (snapshot) => {
        temp = snapshot.val();

        var i = 0;
        for (var attr in temp) {
          i++;
          if (i > num_of_messages) {
            break;
          }
          messages.push(temp[attr]);
        }

        resolve(messages);
      }, reject);
    });
  }

  subscribeToChat(friend_uid: string, sub: (snap) => void) {
    let uid1 : string = firebase.auth().currentUser.uid;
    var path = this.getChatPath(uid1, friend_uid);

    var friendChat = firebase.database().ref(path);

    friendChat.on('value', function(snapshot) {
      sub(snapshot);
    });
  }

  unsubscribeFromChat(friend_uid: string) {
    let uid1 : string = firebase.auth().currentUser.uid;
    var path = this.getChatPath(uid1, friend_uid);

    var friendChat = firebase.database().ref(path);
    friendChat.off();
  }

  private getChatPath(uid1: string, uid2 : string) : string {
    return uid1 < uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;
  }

}
