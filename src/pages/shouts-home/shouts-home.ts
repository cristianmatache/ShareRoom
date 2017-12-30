import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {Shout} from "../../models/shout";
import { Geolocation } from '@ionic-native/geolocation';
import {Auth} from "../../providers/auth";

/**
 * Generated class for the ShoutsHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shouts-home',
  templateUrl: 'shouts-home.html',
})
export class ShoutsHomePage {

  shouts: Shout[] = [];
  myShout: Shout = null;
  filteredShouts: Shout[] = [];
  searchQuery: string = "";
  user_location = [];
  isFiltering = false;
  filterOptions = {
    category: [],
    type: [],
    byDistance: false
  };
  addShout = {
    name: "Add your shout",
    picture: "https://github.com/TomaAlexandru96/ShareRoom/blob/master/src/assets/images/add-item-dark.png?raw=true",
    type: "New",
    location: [0,0],
    shouter_uid: "",
    shouter: "",
    borrow_time: -123,
    max_borrow_duration: 0,
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private db: Database,
              private geolocation : Geolocation,
              private auth : Auth) {

  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.user_location = [resp.coords.latitude, resp.coords.longitude];
      this.refresh();
    });
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.db.getAllShouts().then((shouts) => {
      this.shouts = shouts;
      this.someFunction(this.shouts).then(() => {
        this.shouts = this.shouts.filter((shout) => {
          if (shout.shouter_uid == this.auth.getCurrentUserId()) {
            this.myShout = shout;
            return false;
          }
          return true;
        });
        if (this.myShout != null) {
          this.shouts.unshift(this.myShout);
        }

        this.shouts.unshift(this.addShout);
        this.filteredShouts = this.shouts;

        console.log("ALL SHOUTS *******");
        console.log(this.shouts);
      });
    });
  }

  someFunction = (myArray) => {
    const promises = myArray.map(async (shout) => {
      this.auth.getUserInfoById(shout.shouter_uid).then(
        (user) => {
          shout.shouter = user.display_name;
          return shout;
        }
      ).catch(console.error);
    });
    return Promise.all(promises);
  };

  removeMyShout() {
    this.db.removeLoggedInUserShout();
    this.navCtrl.setRoot(ShoutsHomePage);
  }

  onSearch(event) {
    this.filteredShouts = this.shouts.filter((item) => {
      return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  getDistanceTill(item) {
    if (this.user_location && item) {
      var lat = this.user_location[0];
      var lon = this.user_location[1];
      var distance = this.db.getDistanceFromLatLonInKm(item.location[1], item.location[0], lat, lon);
      return distance.toFixed(1) + " km";
    } else {
      return "";
    }
  }

  // not really working for web app
  getNumberOfColumns() {
    var nrList = [];
    for (var i = 0; i < Math.floor(window.innerWidth / 150); i++) {
      nrList.push(i);
    }
    return nrList;
  }

  getAddShoutPage() {
    return this.navCtrl.push("AddShoutPage");
  }

  goToOtherUsersPage(user_uid) {
    // TO DO: change to users reviews page not add reviews page
    if (user_uid != this.auth.getCurrentUserId()) {
      this.navCtrl.push("UserProfilePage", {"userId": user_uid});
    }
  }

  chatWithUser(userId) {
    this.navCtrl.push("ChatPage", {"friendId": userId});
  }

  shoutBelongsToLoggedInUser(shout) {
    return shout.shouter_uid === this.auth.getCurrentUserId();
  }

  filter() {
    this.isFiltering = !this.isFiltering;
    this.filterOptions = {
      category: [],
      type: [],
      byDistance: false
    };
  }

  filterChanged() {
    this.onSearch(this.searchQuery);
    if (this.filterOptions.type.length > 0) {
      this.filteredShouts = this.filteredShouts.filter(item => {
        return this.filterOptions.type.indexOf(item.type) > -1;
      });
    }

    if (this.filterOptions.byDistance) {
      this.filteredShouts.sort((a, b) => {
        if (a === this.addShout) {
          return -1;
        }
        if (b === this.addShout) {
          return 1;
        }
        let aDist = this.db.getDistanceFromLatLonInKm(this.user_location[0], this.user_location[1], a.location[1], a.location[0]);
        let bDist = this.db.getDistanceFromLatLonInKm(this.user_location[0], this.user_location[1], b.location[1], b.location[0]);

        if (aDist > bDist) {
          return 1;
        } else if (aDist < bDist) {
          return -1;
        } else {
          return 0;
        }
      })
    }
  }
}
