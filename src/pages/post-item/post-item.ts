import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera';
import { ActionSheetController, ToastController, Platform } from 'ionic-angular';
import { Database } from "../../providers/database";
import { HomePage } from "../home/home";
import {default as firebase, storage} from "firebase";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Auth} from "../../providers/auth";

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

  name: AbstractControl;
  description: AbstractControl;
  postForm: FormGroup;
  ONE_DAY_AS_MS : number = 86400000;
  currentlyPostingItem: boolean = false;

  private isActiveToast: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
              public platform: Platform, private formBuilder: FormBuilder,
              public database: Database, private auth : Auth) {
    this.postForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(20)])],
      category: ['Other', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      picture: [''],
      max_borrow_duration: [''],
    });
  }

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

  async selectPic() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    try {
      const result = await this.camera.getPicture(options);
      const image = 'data:image/jpeg;base64,' + result;
      const pictures = storage().ref('pictures/' + this.auth.getCurrentUserId() + '/' + firebase.database.ServerValue.TIMESTAMP);
      await pictures.putString(image, 'data_url');
      const downloadURL = await pictures.getDownloadURL();
      this.postForm.value.picture = downloadURL;
      (document.getElementById('picture') as HTMLImageElement).src = this.postForm.value.picture;
    } catch (e) {
      console.log(e);
    }
  }

  async takePic() {
    console.log("TAKE PIC");
    const options : CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    try {
      const result = await this.camera.getPicture(options);
      const image = 'data:image/jpeg;base64,' + result;
      const pictures = storage().ref('pictures/' + this.auth.getCurrentUserId() + '/' + firebase.database.ServerValue.TIMESTAMP);
      await pictures.putString(image, 'data_url');
      pictures.getDownloadURL().then((downloadURL) =>
      {
        this.postForm.value.picture = downloadURL;
        (document.getElementById('picture') as HTMLImageElement).src = this.postForm.value.picture;
      });
    } catch (e) {
      console.log(e);
    }
  }

  addItem(form) {
    this.findMaxBorrowDuration(form);

    this.currentlyPostingItem = true;

    this.database.addItem(
      form.name,
      form.description,
      form.picture,
      form.type,
      form.max_borrow_duration,
      form.category).then((resp) => {
      this.navCtrl.pop();
    });

  }

  private findMaxBorrowDuration(form) {

    if (form.type != "Loan") {
      form.max_borrow_duration = null;
      return;
    }
    form.max_borrow_duration = this.ONE_DAY_AS_MS;
    // switch(this.borrow_duration) {
    //   case "one_day": form.max_borrow_duration = this.ONE_DAY_AS_MS; break;
    //   case "two_days": form.max_borrow_duration = this.ONE_DAY_AS_MS * 2; break;
    //   case "three_days": form.max_borrow_duration = this.ONE_DAY_AS_MS * 3; break;
    //   case "five_days": form.max_borrow_duration = this.ONE_DAY_AS_MS * 5; break;
    //   case "one_week": form.max_borrow_duration = this.ONE_DAY_AS_MS * 7; break;
    //   case "two_weeks": form.max_borrow_duration = this.ONE_DAY_AS_MS * 14; break;
    //   case "four_weeks": form.max_borrow_duration = this.ONE_DAY_AS_MS * 28; break;
    //   // TODO: we shouldn't allow user to submit item without checking for valid borrow duration.
    //   // So temporarily one day is the default.
    //   default: form.max_borrow_duration = this.ONE_DAY_AS_MS;
    // }
  }

}
