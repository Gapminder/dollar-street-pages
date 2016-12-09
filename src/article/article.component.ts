import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService, TitleHeaderService } from '../common';
import { ArticleService } from './article.service';
import { LanguageService } from '../shared';

@Component({
  selector: 'article-page',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit, OnDestroy {
  public articleService: ArticleService;
  public articleServiceSubscribe: Subscription;
  public article: any;
  public thingId: string;
  public activatedRoute: ActivatedRoute;
  public queryParamsSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public languageService: LanguageService;

  public constructor(activatedRoute: ActivatedRoute,
                     loaderService: LoaderService,
                     articleService: ArticleService,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService) {
    this.articleService = articleService;
    this.activatedRoute = activatedRoute;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.queryParamsSubscribe = this.activatedRoute.params
      .subscribe((params: any) => {
        this.thingId = params.id;
      });

    this.articleServiceSubscribe = this.articleService
      .getArticle(`id=${this.thingId}${this.languageService.getLanguageParam()}`)
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
