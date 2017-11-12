import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
import { ActionSheetController, ToastController, Platform } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Item } from '../../models/item'
import { Database } from "../../providers/database";

/**
 * Generated class for the AddItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-post-item',
  templateUrl: 'post-item.html',
})
export class PostItemPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              private transfer: Transfer, private file: File, private filePath: FilePath,
              public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
              public platform: Platform, public loadingCtrl: LoadingController,
              public database: Database) {

  }

  lastImage = "src/assets/image/bed.jpg";
  ONE_DAY_AS_MS : number = 86400000;
  borrow_duration: string;

  item = {} as Item;
  private isActiveToast: boolean = false;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true
  };

  private presentToast(toastMessage: string) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      this.isActiveToast = false;
    });

    if (!this.isActiveToast) {
      toast.present();
      this.isActiveToast = true;
    }
  }

  public changePhoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose source',
      buttons: [
        {
          text: 'Photo Library',
          handler: () => {
            this.selectPic();
          }
        }, {
          text: 'Camera',
          handler: () => {
            this.takePic();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  selectPic() {
    this.camera.getPicture({
      quality: this.options.quality,
      destinationType: this.options.destinationType,
      encodingType: this.options.encodingType,
      mediaType: this.options.mediaType,
      sourceType: PictureSourceType.PHOTOLIBRARY
    })
      .then((imageData) => {
        this.item.picture = imageData;
        console.log("The image data is:" + imageData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  takePic() {
    this.camera.getPicture(this.options)
      .then((imageData) => {
        this.item.picture = imageData;
        console.log(imageData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // TODO: why not simply have addItem(Item item) in the db?
  addItem() {
    this.findMaxBorrowDuration();

    this.database.addItem(
      this.item.name,
      this.item.description,
      this.item.picture,
      this.item.type,
      this.item.max_borrow_duration,
      this.item.category);
  }

  private findMaxBorrowDuration() {

    if (this.item.type != "Loan") {
      this.item.max_borrow_duration = null;
      return;
    }

    switch(this.borrow_duration) {
      case "one_day": this.item.max_borrow_duration = this.ONE_DAY_AS_MS; break;
      case "two_days": this.item.max_borrow_duration = this.ONE_DAY_AS_MS * 2; break;
      case "three_days": this.item.max_borrow_duration = this.ONE_DAY_AS_MS * 3; break;
      case "five_days": this.item.max_borrow_duration = this.ONE_DAY_AS_MS * 5; break;
      case "one_week": this.item.max_borrow_duration = this.ONE_DAY_AS_MS * 7; break;
      case "two_weeks": this.item.max_borrow_duration = this.ONE_DAY_AS_MS * 14; break;
      case "four_weeks": this.item.max_borrow_duration = this.ONE_DAY_AS_MS * 28; break
      // TODO: we shouldn't allow user to submit item without checking for valid borrow duration.
      // So temporarily one day is the default.
      default: this.item.max_borrow_duration = this.ONE_DAY_AS_MS;
    }
  }

}
