import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserReviewsPage } from './user-reviews';

@NgModule({
  declarations: [
    UserReviewsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserReviewsPage),
  ],
  exports: [
    UserReviewsPage,
  ]
})
export class UserReviewsPageModule {}
