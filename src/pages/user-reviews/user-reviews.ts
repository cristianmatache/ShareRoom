import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Review} from "../../models/review";
import {Database} from "../../providers/database";
import {Auth} from "../../providers/auth";

/**
 * Generated class for the UserReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-reviews',
  templateUrl: 'user-reviews.html',
})
export class UserReviewsPage {

  retrievedReviews: Array<Review> = [];
  userName: string;
  imagePath: string;
  userId: string;
  average: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database, private auth : Auth) {
    this.userId = navParams.get("userId");
    this.userName = navParams.get("userName");
    this.imagePath = navParams.get("imagePath");
  }

  someFunction = (myArray) => {
    const promises = myArray.map(async (review) => {
      this.auth.getUserInfoById(review.user_id).then(
        (user) => {
          review.reviewer_name = user.display_name;
          // console.log("IN SOME FUNCTION LOGGED IN REVIEWS: " + user.display_name);
          return review;
        }
      ).catch(console.error);
    });
    return Promise.all(promises);
  };

  ionViewDidLoad() {
    this.auth.getUserInfoById(this.userId).then((user) => {
      this.userName = user.display_name;
      this.imagePath = user.profile_picture;
      this.db.getAllReviewsOfUID(this.userId).then((reviews) => {
        this.retrievedReviews = reviews;
        this.average = this.computeAverage(reviews);
        this.someFunction(this.retrievedReviews);
      });
    });
    console.log('ionViewDidLoad UserReviewsPage');
  }

  goToOtherUsersPage(userId) {
    if (userId != this.auth.getCurrentUserId()) {
      this.navCtrl.push("UserProfilePage", {"userId": userId});
    }
  }

  goToUserProfile() {
    this.navCtrl.push("UserProfilePage", {"userId": this.userId});
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
