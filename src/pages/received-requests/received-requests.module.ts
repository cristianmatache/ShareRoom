import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivedRequestsPage } from './received-requests';

@NgModule({
  declarations: [
    ReceivedRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivedRequestsPage),
  ],
  exports: [
    ReceivedRequestsPage,
  ]
})
export class ReceivedRequestsPageModule {}
