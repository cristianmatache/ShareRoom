import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ShareRoom } from './app.component';
import { HomePage } from '../pages/home/home'
import { LoginPage } from '../pages/login/login'
import { FIREBASE_CONFIG } from "./app.firebase.config";

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { Database } from '../providers/database';
import { Chat } from "../providers/chat";
import { Auth } from "../providers/auth";
import { Geolocation } from '@ionic-native/geolocation';
import {MapPage} from "../pages/map/map";
import {PostItemPage} from "../pages/post-item/post-item";
import {TabsPage} from "../pages/tabs/tabs";
import {ProfilePage} from "../pages/profile/profile";
//import {LoggedInReviewsPage} from "../pages/logged-in-reviews/logged-in-reviews";
import {EditItemPage} from "../pages/edit-item/edit-item";
import {ShoutsHomePage} from "../pages/shouts-home/shouts-home";
import {ChatListPage} from "../pages/chat-list/chat-list";
import {ChatListPageModule} from "../pages/chat-list/chat-list.module";

@NgModule({
  declarations: [
    ShareRoom,
    HomePage,
    LoginPage,
    MapPage,
    //PostItemPage,
    TabsPage,
    ProfilePage,
    //LoggedInReviewsPage,
    EditItemPage,
    ShoutsHomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ShareRoom),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ChatListPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ShareRoom,
    HomePage,
    LoginPage,
    MapPage,
    //PostItemPage,
    TabsPage,
    ProfilePage,
    //LoggedInReviewsPage,
    EditItemPage,
    ShoutsHomePage,
    ChatListPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    AngularFireDatabaseModule,
    Database,
    Chat,
    Auth,
    Geolocation,
    File,
    Camera,
    Transfer,
    FilePath,
    LoadingController,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
