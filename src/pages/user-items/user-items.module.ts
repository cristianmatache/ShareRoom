import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserItemsPage } from './user-items';

@NgModule({
  declarations: [
    UserItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserItemsPage),
  ],
  exports: [
    UserItemsPage,
  ]
})
export class UserItemsPageModule {}
