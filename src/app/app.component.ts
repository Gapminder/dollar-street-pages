import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService, LocalStorageService, UrlChangeService } from '../common';
import { LanguageService } from '../shared';
import { TranslateService } from 'ng2-translate';
import { stringify } from '@angular/core/src/facade/lang';
import { map } from 'lodash';

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
  public getLanguageToUseSubscribe: Subscription;
  public translateOnLangChangeSubscribe: Subscription;
  public getLanguageToUse: string;
  public getLangsSubscribe: Subscription;

  public translate: TranslateService;
  public getLanguageService: LanguageService;
  public loaderService: LoaderService;
  public urlChangeService: UrlChangeService;
  public localStorageService: LocalStorageService;

  public constructor(router: Router,
                     getLanguageService: LanguageService,
                     translate: TranslateService,
                     loaderService: LoaderService,
                     urlChangeService: UrlChangeService,
                     localStorageService: LocalStorageService) {
    this.router = router;
    this.loaderService = loaderService;
    this.translate = translate;
    this.getLanguageService = getLanguageService;
    this.urlChangeService = urlChangeService;
    this.localStorageService = localStorageService;
  }

  public ngOnInit(): void {
    let storageLanguage: any = this.localStorageService.getItem('language');

    this.translate.setDefaultLang('en');
    this.getLanguageToUse = storageLanguage || this.translate.getBrowserLang() || this.translate.getDefaultLang();

    this.getLangsSubscribe = this.getLanguageService.getLanguagesList()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        let availableLanguages: any[] = map(res.data, (item: any) => item.language);

        this.translate.addLangs(availableLanguages);
      });

    this.getLanguageService.setCurrentLanguage(this.getLanguageToUse);

    let lang = stringify('lang=' + this.getLanguageToUse);

    this.getLanguageToUseSubscribe = this.getLanguageService.getLanguage(lang)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.translate.setTranslation(this.getLanguageToUse, res.data.interface);
        this.translate.use(this.getLanguageToUse);

        this.getLanguageService.setCurrentLanguage(this.getLanguageToUse);
      });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      let translations = event.translations;
      let langToUse: any = event.lang;

      this.translate.setTranslation(langToUse, translations);

      this.getLanguageService.setCurrentLanguage(langToUse);
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

        this.getLanguageService.updateLangUrl();
      }
    });
  }

  public ngOnDestroy(): void {
    this.getLangsSubscribe.unsubscribe();
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();
    this.getLanguageToUseSubscribe.unsubscribe();
    this.translateOnLangChangeSubscribe.unsubscribe();
  }
}
