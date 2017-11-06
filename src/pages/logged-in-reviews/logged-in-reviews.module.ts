import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoggedInReviewsPage } from './logged-in-reviews';

@NgModule({
  declarations: [
    LoggedInReviewsPage,
  ],
  imports: [
    IonicPageModule.forChild(LoggedInReviewsPage),
  ],
  exports: [
    LoggedInReviewsPage
  ]
})
export class LoggedInReviewsPageModule {}
