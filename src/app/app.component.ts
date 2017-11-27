import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {Auth} from "../providers/auth";
import {LoginPage} from "../pages/login/login";
import {User} from "../models/user";
import {TabsPage} from "../pages/tabs/tabs";
import {Database} from "../providers/database";
import {ChatListPage} from "../pages/chat-list/chat-list";
@Component({
  templateUrl: 'app.html'
})
export class ShareRoom {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth: Auth, private db : Database) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }

      this.subscribeLoginEvent()
    });
  }

  subscribeLoginEvent() {
    this.db.subscribeLoginEvent(() => {
      if (this.db.isLoggedin()) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }
}
