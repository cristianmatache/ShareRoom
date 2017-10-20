import { Component, Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Events } from 'ionic-angular';
import { Message } from '../models/message';

@Injectable()
export class Chat {

  private database_chats = firebase.database().ref('/chats');

  constructor(public events: Events, private afAuth: AngularFireAuth, private afData: AngularFireDatabase) {

  }

  sendMessage(msg : string, uid2: string) : Promise<Message> {
    if (this.otherUser) {
      let uid1 : string = firebase.auth().currentUser.uid;
      var path = this.getChatPath(uid1, uid2);

      var promise = new Promise((resolve, reject) => {
        this.database_chats.child(path).push({
          text: msg,
          from: uid2,
          by: uid1,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        })
      })
      return promise;
    }
  }

  getFriendMessages(num_of_messages : number, friend_iud : string) : Array<Message> {
    let temp;
    let messages : Array<Message> = [];
    let uid1 : string = firebase.auth().currentUser.uid;
    var path = this.getChatPath(uid1, friend_iud);
    this.database_chats.child(path).on('value', (snapshot) => {
      temp = snapshot.val();
      for (var i = 0; i < num_of_messages && i < temp.length; i++) {
        messages.push(temp[i]);
      }
    })
    return messages;
  }

  private getChatPath(uid1: string, uid2 : string) : string {
    return uid1 < uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;
  }

}
