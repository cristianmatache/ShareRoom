import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
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

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
    // Get the data of an image
    console.log("TAKE PICTURE! (both lib and camera)");
    this.camera.getPicture(this.options).then((imagePath) => {
      console.log("TAKE PICTURE FROM CAMERA!");
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        console.log("TAKE PICTURE FROM LIBRARY!");
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
  }

  //Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "http://yoururl/upload.php";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    // const loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // loading.present();
    //
    // // Use the FileTransfer to upload the image
    // fileTransfer.upload(targetPath, url, options).then(data => {
    //   loading.dismissAll()
    //   this.presentToast('Image succesful uploaded.');
    // }, err => {
    //   loading.dismissAll()
    //   this.presentToast('Error while uploading file.');
    // });
  }

  addItem() {
    this.database.addItem(this.item.name, this.item.description);
  }

}
