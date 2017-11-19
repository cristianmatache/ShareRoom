import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database } from "../../providers/database";
import { Review} from "../../models/review";

/**
 * Generated class for the LoggedInReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logged-in-reviews',
  templateUrl: 'logged-in-reviews.html',
})
export class LoggedInReviewsPage {

  retrievedReviews : Review[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db : Database) {
  }

  ionViewDidLoad() {
    this.db.getAllLoggedInReviews().then((reviews) => { this.retrievedReviews = reviews;});
    console.log('ionViewDidLoad LoggedInReviewsPage');
  }

  getInnerWidth() {
    return window.innerWidth;
  }
}
