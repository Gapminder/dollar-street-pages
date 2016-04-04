/**
 * Created by igor on 3/30/16.
 */
import {provide,ApplicationRef} from 'angular2/core'
import {ROUTER_PRIMARY_COMPONENT,APP_BASE_HREF,ROUTER_PROVIDERS,RouteParams} from 'angular2/router';
import {MockApplicationRef} from 'angular2/src/mock/mock_application_ref'
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from '../../../app/app.component';
import {StreetDrawService} from '../../../app/common/street/street.service';
import {MatrixService} from '../../../app/matrix/matrix.service';
import {HeaderService} from '../../../app/common/header/header.service';
import {SearchService} from '../../../app/common/search/search.service';
import {CountryInfoService} from '../../../app/country/country-info/country-info.service';
import {CountryPlacesService} from '../../../app/country/country-places/country-places.service';
import {MainPlacesService} from '../../../app/main/places/main.places.service.ts';
import {ThingsMainService} from '../../../app/main/things/things.main.service';
import {PlaceStreetService} from '../../../app/place/place-street.service.ts';
import {FamilyPlaceService} from '../../../app/place/family/family-place.service';
import {ConceptMainService} from '../../../app/main/concept/concept.main.service';
import {MapService} from '../../../app/map/map.service';
import {UrlChangeService} from '../../../app/common/url-change/url-change.service';
import {PhotographersService} from '../../../app/all-photographers/photographers/photographers.service';
import {PhotographerProfileService} from '../../../app/photographer/photographer-profile/photographer-profile.service';
import {PhotographerPlacesService} from '../../../app/photographer/photographer-places/photographer-places.service';
import {AmbassadorsListService} from '../../../app/ambassadors/ambassadors-list/ambassadors-list.service';
import {SocialShareButtonsService} from '../../../app/common/social_share_buttons/social-share-buttons.service';

import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';


import {Angulartics2} from 'angulartics2/index';

export class MockCommonDependency {
  getProviders():Array<any> {
    return [
      ROUTER_PROVIDERS,
      HTTP_PROVIDERS,
      provide(RouteParams, {useClass: MockRouteParams}),
      provide("StreetDrawService", {useClass: StreetDrawService}),
      provide("ConceptMainService", {useClass: ConceptMainService}),
      provide("ThingsMainService", {useClass: ThingsMainService}),
      provide("MatrixService", {useClass: MatrixService}),
      provide("HeaderService", {useClass: HeaderService}),
      provide("SearchService", {useClass: SearchService}),
      provide("MainPlacesService", {useClass: MainPlacesService}),
      provide("PlaceStreetService", {useClass: PlaceStreetService}),
      provide("FamilyPlaceService", {useClass: FamilyPlaceService}),
      provide("MapService", {useClass: MapService}),
      provide("UrlChangeService", {useClass: UrlChangeService}),
      provide("PhotographerProfileService", {useClass: PhotographerProfileService}),
      provide("PhotographerPlacesService", {useClass: PhotographerPlacesService}),
      provide("AmbassadorsListService", {useClass: AmbassadorsListService}),
      provide("CountryInfoService", {useClass: CountryInfoService}),
      provide("CountryPlacesService", {useClass: CountryPlacesService}),
      provide("PhotographersService", {useClass: PhotographersService}),
      provide("SocialShareButtonsService", {useClass: SocialShareButtonsService}),

      provide(APP_BASE_HREF, {useValue: '/'}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppComponent}),
      provide(ApplicationRef, {useClass: MockApplicationRef}),
      provide(Angulartics2, {useClass: Angulartics2}),
    ];
  }
}

class MockRouteParams{
  private params:any={};
  set(key:string, value:string):void{
    this.params[key]=value;
  }
  get(key:string):void{
    return this.params[key];
  }
}
