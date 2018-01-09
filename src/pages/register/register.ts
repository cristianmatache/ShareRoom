import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { TabsPage } from "../tabs/tabs";
import { LoginPage} from "../login/login";
import {Database} from "../../providers/database";
import {isNull} from "util";
import {Auth} from "../../providers/auth";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;
  confirmPass = {value: ""};

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public db: Database, private auth : Auth) {
    this.user.password = "";
    this.user.display_name = "";
    this.user.email = "";
    this.user.phoneNumber = "";
    this.user.profile_picture = "https://github.com/TomaAlexandru96/ShareRoom/blob/master/src/assets/images/default_user.png?raw=true";
  }

  presentAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  home() {
    this.navCtrl.push('LoginPage');
  }

  register() {
    var error = "";
    if (this.user.password === "" || this.user.display_name === "" ||
          this.user.email === "" || this.user.phoneNumber === "") {
      error += "All fields are mandatory\n"
    }

    if (this.user.password !== this.confirmPass.value) {
      error += "Passwords don't match \n"
    }

    if (error != "") {
      this.presentAlert(error);
      return
    }

    this.auth.registerEmail(this.user).then(data => {
      this.auth.login(this.user).catch(error => {
        this.presentAlert(error)
      })
    }).catch(error => {
      this.presentAlert(error);
    });
  }
}
