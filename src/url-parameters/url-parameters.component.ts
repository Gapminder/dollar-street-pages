import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppStates } from '../interfaces';
import { UrlParametersService } from './url-parameters.service';
import { Subscription } from 'rxjs/Subscription';
import { forEach, get } from 'lodash';
import { PagePositionService } from "../shared/page-position/page-position.service";
import { DefaultUrlParameters } from "../defaultState";

interface NavigationEndInterface {
  id: number;
  url: string;
  urlAfterRedirects: string;
}

@Component({
  selector: 'url-parameters',
  template: '',
})
export class UrlParametersComponent implements OnInit, OnDestroy {
  private subscribtions: Subscription[] = [];

  constructor(
    router: Router,
    store: Store<AppStates>,
    urlParametersService: UrlParametersService,
    pagePositionService: PagePositionService,
    location: Location) {
    const navigationEndSubscribe = router.events
      .filter(event => event instanceof NavigationEnd)
      .take(1)
      .subscribe((event: NavigationEndInterface) => {
        const params = urlParametersService.parseString(event.url);
        urlParametersService.dispatchToStore(params);
        urlParametersService.combineUrlPerPage();
        if (get(params, 'row', false)
          && params.row !== DefaultUrlParameters.row) {
          urlParametersService.needPositionByRoute = params.row;
        }
        if (get(params, 'activeHouse', false)) {
          urlParametersService.activeHouseByRoute = params.activeHouse;
        }
        if (get(params, 'activeImage', false)) {
          urlParametersService.activeImageByRoute = params.activeImage;
        }
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
      console.log(event)
      const params = urlParametersService.parseString(event.url);
      urlParametersService.dispatchToStore(params);
      urlParametersService.combineUrlPerPage();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    forEach(this.subscribtions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
