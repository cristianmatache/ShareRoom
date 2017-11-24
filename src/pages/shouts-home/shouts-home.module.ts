import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoutsHomePage } from './shouts-home';

@NgModule({
  declarations: [
    ShoutsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(ShoutsHomePage),
  ],
  exports: [
    ShoutsHomePage,
  ]
})
export class ShoutsHomePageModule {}
