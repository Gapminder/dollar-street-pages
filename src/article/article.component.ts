import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService, TitleHeaderService, LanguageService } from '../common';

import { ArticleService } from './article.service';

@Component({
  selector: 'article-page',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit, OnDestroy {
  public window: Window = window;
  public isDesktop: boolean;
  public articleServiceSubscribe: Subscription;
  public article: any;
  public thingId: string;
  public queryParamsSubscribe: Subscription;
  public element: HTMLElement;
  public showTranslateMe: boolean;

  public constructor(elementRef: ElementRef,
                     private activatedRoute: ActivatedRoute,
                     private loaderService: LoaderService,
                     private articleService: ArticleService,
                     private titleHeaderService: TitleHeaderService,
                     private languageService: LanguageService) {
    this.element = elementRef.nativeElement;
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
          // TODO handle the error
          console.error(val.err);
          return;
        }

        this.article = val.data;
        this.titleHeaderService.setTitle(this.article.thing);

        this.article.description = this.article.description
          .replace(/gapminder\.org/g, location.host);

        if (!this.article.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
          this.showTranslateMe = true;
        }

        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    if (this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }

    if (this.articleServiceSubscribe) {
      this.articleServiceSubscribe.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }
}
