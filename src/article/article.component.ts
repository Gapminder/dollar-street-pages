import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService, TitleHeaderService } from '../common';
import { ArticleService } from './article.service';

@Component({
  selector: 'article-page',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']/*,
   encapsulation: ViewEncapsulation.None*/
})

export class ArticleComponent implements OnInit, OnDestroy {
  private articleService: ArticleService;
  private articleServiceSubscribe: Subscription;
  private article: any;
  private thingId: string;
  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;
  private loaderService: LoaderService;

  public constructor(activatedRoute: ActivatedRoute,
                     loaderService: LoaderService,
                     articleService: ArticleService,
                     titleHeaderService: TitleHeaderService) {
    this.articleService = articleService;
    this.activatedRoute = activatedRoute;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.queryParamsSubscribe = this.activatedRoute.params
      .subscribe((params: any) => {
        this.thingId = params.id;
      });

    this.articleServiceSubscribe = this.articleService
      .getArticle(`id=${this.thingId}`)
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.article = val.data;
        this.titleHeaderService.setTitle(this.article.thing);
        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
    this.articleServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
