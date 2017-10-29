import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'

import {Database} from "../../providers/database";
import {HomePage} from "../home/home";

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private database: Database) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmFydGltYWV1czEwNzMiLCJhIjoiY2o5Y3JreW8wMjFtcjMzdDQxMzV1dW5qaCJ9.zD5CWEgzi2GGq9vMU9Ylog';
  }

 static toFeature(longitude: number, latitude: number, title: string): any{
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "title": title,
        "icon": "monument"
      }
    };
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {

      let map = new mapboxgl.Map({
        container: 'map_id',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [resp.coords.longitude, resp.coords.latitude],
        zoom: 9, // Ideal zoom is somewhere between 12-15
      });

      map.on('load', () => {

        this.database.getAllItems().then(function(items) {

          let features = items.map(function(item) {
            return MapPage.toFeature(item.location[0], item.location[1], "faketitle")
          });

          map.addLayer({
            "id": "item-pins",
            "type": "symbol",
            "source": {
              "type": "geojson",
              "data": {
                "type": "FeatureCollection",
                "features": features
              }
            },
            "layout": {
              "icon-image": "{icon}-15",
              "text-field": "{title}",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 0.6],
              "text-anchor": "top"
            }
          });
        });
      });

      // On clicking an item, go to the item page.
      map.on('click', 'item-pins', function (item) {
        map.flyTo({center: item.features[0].geometry.coordinates});
      });

      // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
      map.on('mouseenter', 'item-pins', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'item-pins', function () {
        map.getCanvas().style.cursor = '';
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  changeToHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
