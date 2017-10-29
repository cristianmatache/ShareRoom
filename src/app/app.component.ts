import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {Database} from "../providers/database";
import {LoginPage} from "../pages/login/login";
import {User} from "../models/user";
import {MapPage} from "../pages/map/map";
import {AddItemPage} from "../pages/add-item/add-item";
@Component({
  templateUrl: 'app.html'
})
export class ShareRoom {
  rootPage: any = AddItemPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private db: Database) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }

      //this.subscribeLoginEvent();
      //this.fakeLogin();
    });
  }

  subscribeLoginEvent() {
    this.db.subscribeLoginEvent(() => {
      if (this.db.isLoggedin()) {
        this.rootPage = MapPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }

  // fakeLogin() {
  //   this.db.login({email: "hello@google.com", password: "password"} as User).then((data) => {
  //   }).catch((err) => {
  //     console.error(err);
  //   });
  // }
}
