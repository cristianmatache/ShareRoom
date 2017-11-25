import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Database} from "../../providers/database";

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  average : number = 0;
  userId: string;
  userName : string = "Default User";
  imagePath : string = "../../assets/images/dark_star.png";

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.userId = navParams.get("userId");

    this.db.getAllLoggedInReviews().then((reviews) => {
      this.average = this.computeAverage(reviews);
    });
  }

  ionViewDidLoad() {
    this.db.getUserInfoById(this.userId)
      .then((user) => {
        this.userName = user.display_name;
        this.imagePath = user.profile_picture;
        //console.log(this.loggedInName);
      })
      .catch(console.error);
    console.log('ionViewDidLoad UserProfilePage');
  }

  getUserReviews() {
    this.navCtrl.push('UserReviewsPage', {userId: this.userId, userName: this.userName, imagePath: this.imagePath});
  }

  getChat() {
    this.navCtrl.push('ChatPage', {friendId: this.userId});
  }

  getUserItems() {
    this.navCtrl.push('UserItemsPage', {userId: this.userId});
  }

  private computeAverage(reviews) {
    var avg = 0;
    for (var r of reviews) {
      avg += r.rating;
    }
    avg /= reviews.length;
    return Math.round(avg * 100) / 100
  }

}
