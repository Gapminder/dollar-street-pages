import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../common';
import { LanguageService } from '../shared/language-selector/language.service';
import { TranslateService } from 'ng2-translate';
import { stringify } from '@angular/core/src/facade/lang';
import { map } from 'lodash';

@Component({
  selector: 'consumer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  public isLoader: boolean = false;
  public isVisibleHeader: boolean;
  public router: Router;
  public loaderService: LoaderService;
  public routerEventsSubscribe: Subscription;
  public loaderServiceSubscribe: Subscription;

  public translate: TranslateService;
  public getLanguageService: LanguageService;
  public getLanguageToUseSubscribe: Subscription;
  public translateOnLangChangeSubscribe: Subscription;
  public getLanguageToUse: string;
  public getLangsSubscribe: Subscription;

  public constructor(router: Router,
                     getLanguageService: LanguageService,
                     translate: TranslateService,
                     loaderService: LoaderService) {
    this.router = router;
    this.loaderService = loaderService;
    this.translate = translate;
    this.getLanguageService = getLanguageService;
  }

  public ngOnInit(): void {
    this.getLangsSubscribe = this.getLanguageService.getLanguagesList()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        let availableLanguages: any[] = map(res.data, (item: any) => item.language);

        this.translate.addLangs(availableLanguages);
      });

    this.translate.setDefaultLang('en');
    this.getLanguageToUse = this.translate.getBrowserLang() || this.translate.getDefaultLang();

    let lang = stringify('lang=' + this.getLanguageToUse);

    this.getLanguageToUseSubscribe = this.getLanguageService.getLanguage(lang)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.translate.setTranslation(this.getLanguageToUse, res.data.translation);
        this.translate.use(this.getLanguageToUse);
      });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      let translations = event.translations;
      let langToUse = event.lang;
      this.translate.setTranslation(langToUse, translations);
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
      }
    });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();

    if (this.getLanguageToUseSubscribe.unsubscribe) {
      this.getLanguageToUseSubscribe.unsubscribe();
    }

    if (this.getLangsSubscribe.unsubscribe) {
      this.getLangsSubscribe.unsubscribe();
    }

    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }
  }
}
