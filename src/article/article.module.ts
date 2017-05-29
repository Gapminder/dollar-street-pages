import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { ArticleComponent } from './article.component';
import { ArticleService } from './article.service';

@NgModule({
  declarations: [ArticleComponent],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [ArticleService],
  exports: []
})

export class ArticleModule {

}
