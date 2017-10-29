import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {

  constructor(public navCtrl: NavController, public menuCtrl:MenuController) {

  }

  changeToMap() {
    this.navCtrl.setRoot(MapPage);
  }

}
