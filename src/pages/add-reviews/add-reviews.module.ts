import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddReviewsPage } from './add-reviews';

@NgModule({
  declarations: [
    AddReviewsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddReviewsPage),
  ],
})
export class AddReviewsPageModule {}
