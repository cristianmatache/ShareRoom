import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database } from "../../providers/database";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  average : number = 0;
  loggedInName : string = "Default User";
  imagePath : string = "https://github.com/TomaAlexandru96/ShareRoom/blob/master/src/assets/images/dark_star.png?raw=true";

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
  }

  ionViewDidLoad() {
    this.db.getUserInfoById(this.db.getCurrentUserId())
      .then((user) => {
        this.loggedInName = user.display_name;
        this.imagePath = user.profile_picture;
        //console.log(this.loggedInName);
      })
      .catch(console.error);

    this.db.getAllLoggedInReviews().then((reviews) => {
      this.average = this.computeAverage(reviews);
    });
    console.log('ionViewDidLoad ProfilePage');
  }

  getReviews() {
    this.navCtrl.push('LoggedInReviewsPage', {loggedInName: this.loggedInName, imagePath: this.imagePath});
  }

  getBorrowed() {
    this.navCtrl.push('BorrowedItemsPage');
  }

  getMyItems() {
    this.navCtrl.push('MyItemsPage');
  }

  private computeAverage(reviews) {
    var avg = 0;
    for (var r of reviews) {
      avg += r.rating;
    }
    avg /= reviews.length;
    return Math.round(avg * 100) / 100
  }

  logout() {
    this.db.logout()
  }

}
