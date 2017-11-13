import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  NgZone,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStates } from '../interfaces';
import {
  MathService,
  LoaderService,
  UrlChangeService,
  Angulartics2GoogleAnalytics,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService
} from '../common';
import * as AppActions from '../app/ngrx/app.actions';
import { MapService } from './map.service';

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapBox')
  public map: ElementRef;
  @ViewChild('hoverPortrait')
  public hoverPortrait: ElementRef;
  @ViewChildren('marker')
  public markers: QueryList<ElementRef>;
  @ViewChild('mapColor')
  public mapColor: ElementRef;
  @ViewChild('infoBoxContainer')
  public infoBoxContainer: ElementRef;

  public familyTranslate: string;
  public places: any[] = [];
  public getTranslationSubscribe: Subscription;
  public hoverPlace: any = void 0;
  public currentCountry: string;
  public originCurrentCountry: string;

  public resizeSubscribe: Subscription;
  public mapServiceSubscribe: Subscription;
  public countries: any[] = [];
  public element: any;
  public hoverPortraitTop: any;
  public hoverPortraitLeft: any;
  public thing: any;
  public query: string;
  public leftSideCountries: any;
  public seeAllHomes: boolean = false;
  public leftArrowTop: any;
  public onThumb: boolean = false;
  public onMarker: boolean = false;
  public isOpenLeftSide: boolean = false;
  public isDesktop: boolean;
  public isMobile: boolean;
  public shadowClass: {'shadow_to_left': boolean, 'shadow_to_right': boolean};
  public queryParamsSubscribe: Subscription;
  public streetData: DrawDividersInterface;
  public streetServiceSubscribe: Subscription;
  public windowInnerWidth: number = window.innerWidth;
  public currentLanguage: string;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public appState: Observable<any>;
  public streetSettingsStateSubscription: Subscription;
  public appStateSubscription: Subscription;
  public thingsFilterState: Observable<any>;
  public thingsFilterStateSubscription: Subscription;

  public constructor(element: ElementRef,
                     private zone: NgZone,
                     private router: Router,
                     private math: MathService,
                     private mapService: MapService,
                     private loaderService: LoaderService,
                     private activatedRoute: ActivatedRoute,
                     private urlChangeService: UrlChangeService,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private languageService: LanguageService,
                     private store: Store<AppStates>) {
    this.element = element.nativeElement;

    this.currentLanguage = this.languageService.currentLanguage;

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.thingsFilterState = this.store.select((appState: AppStates) => appState.thingsFilter);
  }

  public ngOnInit(): void {
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isMobile = this.browserDetectionService.isMobile();

    this.loaderService.setLoader(false);

    this.getTranslationSubscribe = this.languageService.getTranslation('FAMILY').subscribe((trans: any) => {
      this.familyTranslate = trans;
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (data) {
        if (data.streetSettings) {
          this.streetData = data.streetSettings;
        }
      }
    });

    this.thingsFilterStateSubscription = this.thingsFilterState.subscribe((data: any) => {
      if (data) {
        if (data.thingsFilter) {
          this.thing = data.thingsFilter.thing.originPlural;

          let query: any = {url: `thing=${this.thing}${this.languageService.getLanguageParam()}`};

          this.urlChanged(query);
        }
      }
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (this.query !== data.query) {
          this.query = data.query;
        }
      }
    });

    this.queryParamsSubscribe = this.activatedRoute.queryParams.subscribe((params: {thing: string}) => {
      //this.thing = params.thing ? params.thing : 'Families';

      //let query: any = {url: `thing=${this.thing}${this.languageService.getLanguageParam()}`};

      //if (!params.thing || (params.thing/* && !isInit*/)) {
      //  query.isNotReplaceState = true;
      //}
    });
  }

  public urlChanged(options: {url: string, isNotReplaceState?: any}): void {
    let {url, isNotReplaceState} = options;

    this.mapServiceSubscribe = this.mapService
      .getMainPlaces(url)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.places = res.data.places;
        this.countries = res.data.countries;

        this.query = url;

        if (!isNotReplaceState) {
          this.query = url;
          this.urlChangeService.replaceState('/map', url);
        }

        this.setMarkersCoord(this.places);
        this.loaderService.setLoader(true);

        this.resizeSubscribe = fromEvent(window, 'resize')
          .debounceTime(150)
          .subscribe(() => {
            this.zone.run(() => {
              this.windowInnerWidth = window.innerWidth;

              if (this.windowInnerWidth >= 600) {
                document.body.classList.remove('hideScroll');
              }

              this.setMarkersCoord(this.places);
            });
          });
      });
  }

  public ngOnDestroy(): void {
    if(this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if(this.mapServiceSubscribe) {
      this.mapServiceSubscribe.unsubscribe();
    }

    if(this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }

    if(this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if(this.loaderService) {
      this.loaderService.setLoader(false);
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }

    if (this.thingsFilterStateSubscription) {
      this.thingsFilterStateSubscription.unsubscribe();
    }
  }

  public setMarkersCoord(places: any): void {
    let img = new Image();
    let mapImage: HTMLImageElement = this.mapColor.nativeElement as HTMLImageElement;

    img.onload = () => {
      this.zone.run(() => {
        let width = mapImage.offsetWidth;
        let height = mapImage.offsetHeight;
        let greenwich = 0.439 * width;
        let equator = 0.545 * height;

        places.forEach((place: any) => {
          let stepTop: number = place.lat > 0 ? equator / 75 : (height - equator) / 75;
          let stepRight: number = place.lng < 0 ? greenwich / 130 : (width - greenwich) / 158;

          place.left = place.lng * stepRight + greenwich;
          place.top = equator - place.lat * stepTop - 23;
        });
      });
    };

    img.src = mapImage.src;
  }

  public hoverOnMarker(index: number, country: any, countryOriginName: any): void {
    if (!this.isDesktop) {
      return;
    }

    if (this.isOpenLeftSide) {
      return;
    }

    this.onMarker = true;

    this.originCurrentCountry = countryOriginName;
    this.currentCountry = country;

    this.leftSideCountries = this.places.filter((place: any): boolean => {
      return place.country === this.currentCountry;
    });

    this.seeAllHomes = this.leftSideCountries.length > 1;

    this.places.forEach((place: any, i: number) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });

    if (!this.hoverPlace) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (markerRef: ElementRef, i: number): void => {

      let marker: HTMLElement = markerRef.nativeElement as HTMLElement;

      if (i === index) {
        return;
      }

      marker.style.opacity = '0.3';
    });

    let img = new Image();

    let portraitBox = this.hoverPortrait.nativeElement as HTMLElement;
    portraitBox.style.opacity = '0';

    img.onload = () => {
      this.zone.run(() => {
        if (!this.hoverPlace) {
          return;
        }

        this.hoverPortraitTop = this.hoverPlace.top - portraitBox.offsetHeight;
        this.hoverPortraitLeft = this.hoverPlace.left - (portraitBox.offsetWidth - 15) / 2;
        this.leftArrowTop = void 0;
        this.shadowClass = {'shadow_to_left': true, 'shadow_to_right': false};

        if (this.hoverPortraitTop < 10) {
          this.hoverPortraitTop = 10;
          this.hoverPortraitLeft += (portraitBox.offsetWidth + 32) / 2;
          this.leftArrowTop = this.hoverPlace.top - 9;

          if (portraitBox.offsetHeight - 12 <= this.leftArrowTop) {
            this.leftArrowTop -= 20;
            this.hoverPortraitTop += 20;
          }

          this.shadowClass = {'shadow_to_left': false, 'shadow_to_right': true};
        }

        if (!this.seeAllHomes) {
          this.shadowClass = {'shadow_to_left': false, 'shadow_to_right': false};
        }

        portraitBox.style.opacity = '1';
      });
    };

    img.src = this.hoverPlace.familyImg.background;
  };

  public hoverOnMarkerTablet(index: number, country: any, countryOriginName: any): void {
    if (this.isMobile || this.isDesktop) {
      return;
    }

    if (this.isOpenLeftSide) {
      return;
    }

    this.onMarker = true;
    this.currentCountry = country;
    this.originCurrentCountry = countryOriginName;

    this.leftSideCountries = this.places.filter((place: any): boolean => {
      return place.country === this.currentCountry;
    });

    this.seeAllHomes = this.leftSideCountries.length > 1;

    this.places.forEach((place: any, i: number) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });

    if (!this.hoverPlace) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (markerRef: ElementRef, i: number): void => {
      let marker: HTMLElement = markerRef.nativeElement as HTMLElement;

      if (i === index) {
        return;
      }

      marker.style.opacity = '0.3';
    });
  };

  public unHoverOnMarker(): void {
    if (this.isMobile) {
      return;
    }

    if (this.isOpenLeftSide) {
      return;
    }

    this.onMarker = false;

    setTimeout(() => {
      if (this.onThumb) {
        this.onThumb = !this.onThumb;

        return;
      }

      if (this.onMarker) {
        this.onMarker = !this.onMarker;

        return;
      }

      if (!this.markers) {
        return;
      }

      Array.prototype.forEach.call(this.markers, (markerRef: ElementRef): void => {
        let marker: HTMLElement = markerRef.nativeElement as HTMLElement;

        marker.style.opacity = '1';
      });

      this.seeAllHomes = false;
      this.hoverPlace = void 0;
      this.hoverPortraitTop = void 0;
      this.hoverPortraitLeft = void 0;
    }, 300);
  }

  public openLeftSideBar(): void {
    this.isOpenLeftSide = true;
  }

  public closeLeftSideBar(e: MouseEvent): void {
    let infoBoxContainer = this.infoBoxContainer.nativeElement as HTMLElement;
    infoBoxContainer.scrollTop = 0;

    let el = e.target as HTMLElement;

    if (el.classList.contains('see-all') ||
      el.classList.contains('see-all-span') ||
      (!this.isDesktop && el.classList.contains('marker'))
    ) {
      this.onMarker = false;
      this.onThumb = false;
      this.seeAllHomes = false;
      this.hoverPlace = void 0;
      this.hoverPortraitTop = void 0;
      this.hoverPortraitLeft = void 0;
      this.unHoverOnMarker();

      return;
    }

    this.isOpenLeftSide = false;
    this.onMarker = false;
    this.onThumb = false;

    if (this.windowInnerWidth < 600) {
      document.body.classList.remove('hideScroll');
    }

    if (!el.classList.contains('marker')) {
      this.unHoverOnMarker();
    }
  }

  public clickOnMarker(e: MouseEvent, index: number, country: any, countryOriginName: any): void {
    if (this.isOpenLeftSide) {
      this.isOpenLeftSide = !this.isOpenLeftSide;

      this.closeLeftSideBar(e);
      this.hoverOnMarker(index, country, countryOriginName);

      return;
    }

    if (this.leftSideCountries && this.leftSideCountries.length === 1) {
      this.angulartics2GoogleAnalytics
        .eventTrack(`Look at ${this.hoverPlace.family} place from ${this.hoverPlace.country} with map page`, {});
      this.router.navigate(['/family'], {queryParams: {place: this.hoverPlace._id}});
    }
  }

  public mobileClickOnMarker(country: any, countryOriginName: any): void {
    this.currentCountry = country;
    this.originCurrentCountry = countryOriginName;

    this.leftSideCountries = this.places.filter((place: any): boolean => {
      return place.country === this.currentCountry;
    });

    if (this.leftSideCountries && this.leftSideCountries.length) {
      this.openLeftSideBar();
    }
  }

  public thumbHover(): void {
    this.onThumb = true;
  }

  public toUrl(image: string): string {
    return `url("${image}")`;
  }
}
