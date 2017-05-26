import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService, TitleHeaderService, LanguageService, BrowserDetectionService } from '../common';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { ArticleService } from './article.service';
import { TranslateMeComponent } from '../shared/translate-me/translate-me.component';

@Component({
  selector: 'article-page',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit, OnDestroy {
  @ViewChild(TranslateMeComponent)
  public translateMeComponent: TranslateMeComponent;

  public window: Window = window;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isShowing: boolean = true;
  public articleService: ArticleService;
  public articleServiceSubscribe: Subscription;
  public article: any;
  public thingId: string;
  public activatedRoute: ActivatedRoute;
  public queryParamsSubscribe: Subscription;
  public resizeSubsctibe: Subscription;
  public scrollSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public languageService: LanguageService;
  public element: HTMLElement;
  public articleContent: HTMLElement;

  public constructor(activatedRoute: ActivatedRoute,
                     loaderService: LoaderService,
                     articleService: ArticleService,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService,
                     elementRef: ElementRef,
                     browserDetectionService: BrowserDetectionService) {
    this.element = elementRef.nativeElement;
    this.articleService = articleService;
    this.activatedRoute = activatedRoute;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
    this.device = browserDetectionService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.articleContent = this.element.querySelector('#article-content') as HTMLElement;

    this.isDesktop = this.device.isDesktop();

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

    this.resizeSubsctibe = fromEvent(this.window, 'resize')
        .debounceTime(150)
        .subscribe(() => {
          this.isDesktop = this.window.innerWidth > 1024;

          if (this.translateMeComponent) {
            if (this.isDesktop) {
              this.translateMeComponent.setViewMode('desktop');
            } else {
              this.translateMeComponent.setViewMode('mobile');
            }
          }
        });

    this.scrollSubscribe = fromEvent(document, 'scroll')
        .debounceTime(10)
        .subscribe(() => {
          const canHide: boolean = this.window.scrollY >= this.articleContent.clientHeight - 900;

          if (canHide && this.isDesktop) {
            this.isShowing = false;
          } else {
            this.isShowing = true;
          }
        });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
    this.articleServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
    this.resizeSubsctibe.unsubscribe();
    this.scrollSubscribe.unsubscribe();
  }
}
