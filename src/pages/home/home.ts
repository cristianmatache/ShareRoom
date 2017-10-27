import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {

  constructor(public navCtrl: NavController, public menuCtrl:MenuController) {

  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }



}
