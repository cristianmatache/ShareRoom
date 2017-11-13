import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowedItemsPage } from './borrowed-items';

@NgModule({
  declarations: [
    BorrowedItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(BorrowedItemsPage),
  ],
  exports: [
    BorrowedItemsPage,
  ]
})
export class BorrowedItemsPageModule {}
