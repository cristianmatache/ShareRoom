import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {Shout} from "../../models/shout";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.db.getAllShouts().then((shouts) => {
      this.shouts = shouts;
      this.someFunction(this.shouts).then(() => {
        this.shouts = this.shouts.filter((shout) => {
          if (shout.shouter_uid == this.db.getCurrentUserId()) {
            this.myShout = shout;
            return false;
          }
          return true;
        });
        if (this.myShout != null) {
          this.shouts.unshift(this.myShout);
        }

        this.shouts.unshift({
          name: "Add your shout",
          picture: "https://github.com/TomaAlexandru96/ShareRoom/blob/master/src/assets/images/add-item-dark.png?raw=true",
          type: "New",
          location: [],
          shouter_uid: "",
          shouter: "",
          borrow_time: -123,
          max_borrow_duration: 0,
        });
        this.filteredShouts = this.shouts;

        console.log("ALL SHOUTS *******");
        console.log(this.shouts);
      });
    });
  }

  someFunction = (myArray) => {
    const promises = myArray.map(async (shout) => {
      this.db.getUserInfoById(shout.shouter_uid).then(
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoutsHomePage');
  }

  getDistanceTill(item) {
    return "500 meters";
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
    if (user_uid != this.db.getCurrentUserId()) {
      this.navCtrl.push("AddReviewsPage", {"userToReviewUID": user_uid});
    }
  }

  chatWithUser(userId) {
    this.navCtrl.push("ChatPage", {"friendId": userId});
  }

  shoutBelongsToLoggedInUser(shout) {
    return shout.shouter_uid === this.db.getCurrentUserId();
  }
}
