import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Item} from "../../models/item";
import {Database} from "../../providers/database";
import {Request} from "../../models/request";

/**
 * Generated class for the ReceivedRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-received-requests',
  templateUrl: 'received-requests.html',
})
export class ReceivedRequestsPage {

  item: Item;
  requests: Request[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: Database) {
    this.item = navParams.get("item");
  }

  ionViewDidLoad() {
    // console.log("************** B REQUESTS");
    // console.log(this.item.requests);
    // console.log("**************");
    for (var request of this.item.requests) {
      //req.owner_uid = this.item.owner_uid;

      this.db.getUserInfoById(request.requester_uid).then(
        (user) => {

          var req: Request = {
            requester_uid: request.requester_uid,
            requester_name: "requester default name",
            requester_picture: "",
            borrow_time: request.borrow_time,
            max_borrow_duration: request.max_borrow_duration,
            owner_uid: request.owner_uid,
            owner_picture: "",
            type: request.type,
          };


          //console.log("Found name " + user.display_name);
          req.requester_name = user.display_name;
          req.requester_picture = user.profile_picture;
          //console.log("Pushing name " + req.requester_name);
          this.requests.push(req);
        }
      ).catch(console.error);
    }

    // for (var request of this.item.requests) {
    //   console.log("no me ames 2");
    //   console.log(request);
    // //   request.owner_uid = this.item.owner_uid;
    // //   this.db.getUserInfoById(request.requester_uid)
    // //     .then((user) => {
    // //       request.requester_name = user.display_name;
    // //       request.requester_picture  = user.profile_picture;
    // //     })
    // //     .catch(console.error);
    // //   this.requests.push(request);
    // }
    console.log("***************");
    console.log(this.requests);
    console.log('ionViewDidLoad ReceivedRequestsPage');
  }
}

// var req: Request = {
//   requester_uid: request.requester_uid,
//   requester_name: "requester default name",
//   borrow_time: request.borrow_time,
//   max_borrow_duration: request.max_borrow_duration,
//   owner_uid: request.owner_uid,
//   picture: request.picture,
//   type: request.type,
// };
