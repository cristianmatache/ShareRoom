import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {HomePage} from "../home/home";

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmFydGltYWV1czEwNzMiLCJhIjoiY2o5Y3JreW8wMjFtcjMzdDQxMzV1dW5qaCJ9.zD5CWEgzi2GGq9vMU9Ylog';
  }

  ionViewDidLoad() {
    var map = new mapboxgl.Map({
      container: 'map_id',
      style: 'mapbox://styles/mapbox/streets-v10'
    });
  }

  changeToHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
