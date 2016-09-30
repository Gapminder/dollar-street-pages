import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { LoaderService } from '../common/loader/loader.service';
import { ArticleService } from './article.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';

let tpl = require('./article.template.html');
let style = require('./article.css');

@Component({
  selector: 'article-page',
  template: tpl,
  styles: [style],
  encapsulation: ViewEncapsulation.None
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
        this.titleHeaderService.setTitle('Article about: ' + this.article.thing);
        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
    this.articleServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
