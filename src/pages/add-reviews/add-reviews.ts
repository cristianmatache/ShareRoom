import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Database} from "../../providers/database";
import {Review} from "../../models/review";
import {User} from "../../models/user";

/**
 * Generated class for the AddReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-reviews',
  templateUrl: 'add-reviews.html',
})
export class AddReviewsPage {

  retrievedReviews: Array<Review> = [];
  average: number = 0;
  userToReviewUID: string;
  userToReview: User;
  userToReviewName: string;
  userToReviewPicture: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.userToReviewUID = navParams.get("userToReviewUID");
  }

  someFunction = (myArray) => {
    const promises = myArray.map(async (review) => {
      this.db.getUserInfoById(review.user_id).then(
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
    this.db.getUserInfoById(this.userToReviewUID).then((user) => {
      this.userToReview = user;
      this.userToReviewName = user.display_name;
      this.userToReviewPicture = user.profile_picture;

      this.db.getAllReviewsOfUID(this.userToReviewUID).then((reviews) => {
        this.retrievedReviews = reviews;
        this.average = this.computeAverage(reviews);
        this.someFunction(this.retrievedReviews);
      });
    });
    console.log('ionViewDidLoad AddReviewsPage');
  }

  private computeAverage(reviews) {
    var avg = 0;
    for (var r of reviews) {
      avg += r.rating;
    }
    avg /= reviews.length;
    return Math.round(avg * 100) / 100
  }

  goToOtherUsersPage(reviewer_id) {
    // TO DO: change to users reviews page not add reviews page
    if (reviewer_id != this.db.getCurrentUserId()) {
      this.navCtrl.push("AddReviewsPage", {"userToReviewUID": reviewer_id});
    }
  }
}
