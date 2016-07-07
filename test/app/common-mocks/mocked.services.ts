import {provide, ApplicationRef, NgZone} from '@angular/core';
import {ROUTER_PRIMARY_COMPONENT, ROUTER_PROVIDERS, RouteParams} from '@angular/router-deprecated';
import {APP_BASE_HREF} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';
import {MockNgZone,MockApplicationRef} from '@angular/core/testing';

import {AppComponent} from '../../../app/app.component';
import {MathService} from '../../../app/common/math-service/math-service';
import {StreetDrawService} from '../../../app/common/street/street.service';
import {MatrixService} from '../../../app/matrix/matrix.service';
import {HeaderService} from '../../../app/common/header/header.service';
import {SearchService} from '../../../app/common/search/search.service';
import {CountryInfoService} from '../../../app/country/country-info/country-info.service';
import {CountryPlacesService} from '../../../app/country/country-places/country-places.service';
import {MainPlacesService} from '../../../app/main/places/main.places.service.ts';
import {ThingsMainService} from '../../../app/main/things/things.main.service';
import {ConceptMainService} from '../../../app/main/concept/concept.main.service';
import {MapService} from '../../../app/map/map.service';
import {UrlChangeService} from '../../../app/common/url-change/url-change.service';
import {PhotographersService} from '../../../app/all-photographers/photographers/photographers.service';
import {PhotographerProfileService} from '../../../app/photographer/photographer-profile/photographer-profile.service';
import {PhotographerPlacesService} from '../../../app/photographer/photographer-places/photographer-places.service';
import {AmbassadorsListService} from '../../../app/ambassadors/ambassadors-list/ambassadors-list.service';
import {SocialShareButtonsService} from '../../../app/common/social_share_buttons/social-share-buttons.service';
import {InfoContextService} from '../../../app/info/info-context/info-context.service';

export class MockCommonDependency {
  public getProviders():Array<any> {
    return [
      ROUTER_PROVIDERS,
      HTTP_PROVIDERS,
      provide(RouteParams, {useClass: MockRouteParams}),
      provide(NgZone, {useClass: MockNgZone}),
      provide('StreetDrawService', {useClass: StreetDrawService}),
      provide('ConceptMainService', {useClass: ConceptMainService}),
      provide('ThingsMainService', {useClass: ThingsMainService}),
      provide('MatrixService', {useClass: MatrixService}),
      provide('HeaderService', {useClass: HeaderService}),
      provide('SearchService', {useClass: SearchService}),
      provide('MainPlacesService', {useClass: MainPlacesService}),
      provide('MapService', {useClass: MapService}),
      provide('UrlChangeService', {useClass: UrlChangeService}),
      provide('PhotographerProfileService', {useClass: PhotographerProfileService}),
      provide('PhotographerPlacesService', {useClass: PhotographerPlacesService}),
      provide('AmbassadorsListService', {useClass: AmbassadorsListService}),
      provide('CountryInfoService', {useClass: CountryInfoService}),
      provide('CountryPlacesService', {useClass: CountryPlacesService}),
      provide('PhotographersService', {useClass: PhotographersService}),
      provide('SocialShareButtonsService', {useClass: SocialShareButtonsService}),
      provide('InfoContextService', {useClass: InfoContextService}),
      provide('Math', {useClass: MathService}),
      provide(APP_BASE_HREF, {useValue: '/'}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppComponent}),
      provide(ApplicationRef, {useClass: MockApplicationRef})
    ];
  }
}

class MockRouteParams {
  private params:any = {};

  public set(key:string, value:string):void {
    this.params[key] = value;
  }

  public get(key:string):void {
    return this.params[key];
  }
}
