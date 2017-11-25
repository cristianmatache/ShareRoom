import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddShoutPage } from './add-shout';

@NgModule({
  declarations: [
    AddShoutPage,
  ],
  imports: [
    IonicPageModule.forChild(AddShoutPage),
  ],
  exports: [
    AddShoutPage,
  ]
})
export class AddShoutPageModule {}
