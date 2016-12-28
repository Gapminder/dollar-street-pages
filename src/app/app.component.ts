import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService, LocalStorageService, UrlChangeService } from '../common';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from '../shared/language-selector/language.service';
import { stringify } from '@angular/core/src/facade/lang';

@Component({
  selector: 'consumer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  public window: Window = window;
  public isLoader: boolean = false;
  public isVisibleHeader: boolean;
  public router: Router;
  public routerEventsSubscribe: Subscription;
  public loaderServiceSubscribe: Subscription;
  public languageToUseSubscribe: Subscription;
  public currentLanguage: string;

  public translate: TranslateService;
  public languageService: LanguageService;
  public loaderService: LoaderService;
  public urlChangeService: UrlChangeService;
  public localStorageService: LocalStorageService;

  public constructor(router: Router,
                     languageService: LanguageService,
                     translate: TranslateService,
                     loaderService: LoaderService,
                     urlChangeService: UrlChangeService,
                     localStorageService: LocalStorageService) {
    this.router = router;
    this.loaderService = loaderService;
    this.translate = translate;
    this.languageService = languageService;
    this.urlChangeService = urlChangeService;
    this.localStorageService = localStorageService;
  }

  public ngOnInit(): void {
    const storageLanguage: any = this.localStorageService.getItem('language');

    this.translate.setDefaultLang('en');
    this.currentLanguage = storageLanguage || this.translate.getBrowserLang() || this.translate.getDefaultLang();
    this.languageService.updateLangUrl(this.currentLanguage);

    const lang: string = stringify('lang=' + this.currentLanguage);

    (this.window as any).currentLanguage = this.currentLanguage;
    (this.window as any).detectFont(this.currentLanguage);

    this.languageToUseSubscribe = this.languageService.getLanguage(lang)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        const language: any = res.data;

        if (this.currentLanguage !== language.lang) {
          this.localStorageService.setItem('language', language.lang);
          this.window.location.href = this.window.location.href.replace(`lang=${this.currentLanguage}`, `lang=${language.lang}`);

          return;
        }

        this.translate.setTranslation(this.currentLanguage, language.interface);
        this.translate.use(this.currentLanguage);
      });

    this.loaderServiceSubscribe = this.loaderService
      .getLoaderEvent()
      .subscribe((data: {isLoaded: boolean}) => {
        this.isLoader = data.isLoaded;
      });

    this.routerEventsSubscribe = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let activePage: string = event
          .urlAfterRedirects
          .split('?')
          .shift();

        if (activePage !== '/matrix') {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        this.isVisibleHeader = !(activePage === '/matrix' || activePage === '/family' || activePage === '/map');

        this.languageService.updateLangUrl(this.currentLanguage);
      }
    });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();
    this.languageToUseSubscribe.unsubscribe();
  }
}
