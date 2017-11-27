import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import { Database } from '../../providers/database';
import { User } from '../../models/user';
import {Auth} from "../../providers/auth";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;

  constructor(public navCtrl: NavController,
              public database : Database,
              public alertCtrl: AlertController,
              public auth : Auth) {
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

  login() {
    this.auth.login(this.user).catch(error => {
      this.presentAlert(error)
    })
  }

  presentAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
