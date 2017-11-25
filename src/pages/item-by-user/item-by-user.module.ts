import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemByUserPage } from './item-by-user';

@NgModule({
  declarations: [
    ItemByUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemByUserPage),
  ],
  exports: [
    ItemByUserPage,
  ]
})
export class ItemByUserPageModule {}
