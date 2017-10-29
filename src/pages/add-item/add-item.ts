import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
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
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              private transfer: Transfer, private file: File, private filePath: FilePath,
              public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
              public platform: Platform, public loadingCtrl : LoadingController,
              public database: Database) {

  }

  lastImage = "src/assets/image/bed.jpg";

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

  addItem() {
    this.database.addItem(this.item.name, this.item.description, this.item.picture);
  }

}
