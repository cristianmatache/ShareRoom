import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PostItemPage} from './post-item';

@NgModule({
  declarations: [
    PostItemPage,
  ],
  imports: [
    IonicPageModule.forChild(PostItemPage),
  ],
})
export class PostItemPageModule {}
