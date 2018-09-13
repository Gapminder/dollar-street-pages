import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppStates } from '../interfaces';
import { UrlParametersService } from './url-parameters.service';
import { Subscription } from 'rxjs/Subscription';
import { forEach, get } from 'lodash';
import { PagePositionService } from '../shared/page-position/page-position.service';
import { DefaultUrlParameters } from '../defaultState';
import { LocalStorageService } from '../common/local-storage/local-storage.service';
import { TranslateService } from 'ng2-translate';


interface NavigationEndInterface {
  id: number;
  url: string;
  urlAfterRedirects: string;
}

@Component({
  selector: 'url-parameters',
  template: ''
})
export class UrlParametersComponent implements  OnDestroy {
  private subscribtions: Subscription[] = [];

  constructor(
    router: Router,
    store: Store<AppStates>,
    private urlParametersService: UrlParametersService,
    pagePositionService: PagePositionService,
    location: Location,
    private translate: TranslateService,
    private localStorageService: LocalStorageService) {


    const navigationEndSubscribe = router.events
      .filter(event => event instanceof NavigationEnd)
      .take(1)
      .subscribe((event: NavigationEndInterface) => {
        const params = urlParametersService.parseString(event.url);

        if (!get(params, 'lang', false)) {
          const storageLanguage = this.localStorageService.getItem('language');
          if (storageLanguage) {
            params.lang = storageLanguage;
          } else {
            const browserLanguage = this.translate.getBrowserCultureLang();
            params.lang = browserLanguage;
          }
        }

        urlParametersService.dispatchToStore(params);
        urlParametersService.combineUrlPerPage();

        if (get(params, 'row', false)
          && params.row !== DefaultUrlParameters.row) {
          urlParametersService.needPositionByRoute = params.row;
        }
        if (get(params, 'activeHouse', false)) {
          params.activeHouse = (Number(params.activeHouse) - 1).toString();
          urlParametersService.activeHouseByRoute = params.activeHouse;
        }
        if (get(params, 'activeImage', false)) {
          params.activeImage = (Number(params.activeImage) - 1).toString();
          urlParametersService.activeImageByRoute = params.activeImage;
        }

        this.urlParametersService.setActionAfterViewLoad({
          row: get(params, 'row', null),
          activeHouse: get(params, 'activeHouse', null),
          activeImage: get(params, 'activeImage', null)
        });

      });
    this.subscribtions.push(navigationEndSubscribe);

    const routerSubscribe = router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEndInterface) => {
        if (urlParametersService.needPositionByRoute == null) {
          urlParametersService.removeActiveHouse();
        }
      });
    this.subscribtions.push(routerSubscribe);

    location.subscribe((event: PopStateEvent) => {
      const params = urlParametersService.parseString(event.url);
      urlParametersService.dispatchToStore(params);
      urlParametersService.combineUrlPerPage();
    });
  }

  ngOnDestroy() {
    forEach(this.subscribtions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
