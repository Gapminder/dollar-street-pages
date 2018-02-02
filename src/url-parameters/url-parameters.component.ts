import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppStates } from '../interfaces';
import { UrlParametersService } from './url-parameters.service';
import { Subscription } from 'rxjs/Subscription';
import { forEach } from 'lodash';
import { DEBOUNCE_TIME } from '../defaultState';

interface NavigationEndInterface {
  id: number;
  url: string;
  urlAfterRedirects: string;
}

@Component({
  selector: 'url-parameters',
  templateUrl: './url-parameters.component.html',
  styleUrls: ['./url-parameters.component.css']
})
export class UrlParametersComponent implements OnInit, OnDestroy {
  private subscribtions: Subscription[] = [];

  constructor(
    router: Router,
    store: Store<AppStates>,
    urlParametersService: UrlParametersService,
    location: Location) {
    const routerSubscribe = router.events
      .filter(event => event instanceof NavigationEnd)
      .take(1)
      .subscribe((event: NavigationEndInterface) => {
        console.log(event);
        const params = urlParametersService.parseString(event.url);
        urlParametersService.dispatchToStore(params);
        urlParametersService.combineUrlPerPage();
      });
    this.subscribtions.push(routerSubscribe);

    location.subscribe((event) => {
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
