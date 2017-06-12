import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { ArticleComponent } from './article.component';
import { ArticleService } from './article.service';

import { ArticleRouting } from './article.routing';

import { SharedModule } from '../shared';

@NgModule({
  declarations: [ArticleComponent],
  imports: [
    ArticleRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [ArticleService],
  exports: []
})

export class ArticleModule {}
