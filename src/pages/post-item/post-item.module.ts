import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {AddItemPage} from './post-item';

@NgModule({
  declarations: [
    AddItemPage,
  ],
  imports: [
    IonicPageModule.forChild(AddItemPage),
  ],
})
export class AddItemPageModule {}
