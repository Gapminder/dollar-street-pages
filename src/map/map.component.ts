import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  NgZone,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AppStates,
  Country,
  Currency,
  Place,
  TimeUnit,
  UrlParameters
} from '../interfaces';
import {
  MathService,
  LoaderService,
  UrlChangeService,
  Angulartics2GoogleAnalytics,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService,
  IncomeCalcService
} from '../common';
import { MapService } from './map.service';
import { get } from 'lodash';
import { UrlParametersService } from '../url-parameters/url-parameters.service';
import {
  DEBOUNCE_TIME,
  MOBILE_SIZE
} from '../defaultState';

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
  public countries: Country[] = [];
  public element: any;
  public hoverPortraitTop: any;
  public hoverPortraitLeft: any;
  public thing: any;
  public query: string;
  public leftSideCountries: any;
  public seeAllHomes = false;
  public leftArrowTop: any;
  public onThumb = false;
  public onMarker = false;
  public isOpenLeftSide = false;
  public isDesktop: boolean;
  public isMobile: boolean;
  public shadowClass: {'shadow_to_left': boolean; 'shadow_to_right': boolean};
  public streetData: DrawDividersInterface;
  public currentLanguage: string;
  public appStatesSubscribe: Subscription;
  public timeUnit: TimeUnit;
  public currencyUnit: Currency;

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
                     private store: Store<AppStates>,
                     private incomeCalcService: IncomeCalcService,
                     private changeDetectorRef: ChangeDetectorRef,
                     private urlParametersService: UrlParametersService) {
    this.element = element.nativeElement;

    this.currentLanguage = this.languageService.currentLanguage;

  }

  public ngOnInit(): void {
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isMobile = this.browserDetectionService.isMobile();

    this.loaderService.setLoader(false);

    this.appStatesSubscribe = this.store
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((data: AppStates) => {

      // streetSettings
      this.streetData = get(data, 'streetSettings.streetSettings', this.streetData);

      // matrix
      this.timeUnit = get(data.matrix, 'timeUnit', this.timeUnit);
      this.currencyUnit = get(data.matrix, 'currencyUnit', this.currencyUnit);


      // thingsFilter
      if (get(data, 'thingsFilter.thingsFilter', false)) {
        this.thing = get(data.thingsFilter.thingsFilter, 'thing.originPlural');
        const query = `thing=${encodeURI(this.thing)}${this.languageService.getLanguageParam()}`;

        this.mapServiceSubscribe = this.mapService
          .getMainPlaces(query)
          .subscribe((res) => {
            if (res.err) {
              return;
            }

            this.places = res.data.places;
            this.countries = res.data.countries;

            this.setMarkersCoord(this.places);
            this.loaderService.setLoader(true);

            this.resizeSubscribe = fromEvent(window, 'resize')
              .debounceTime(DEBOUNCE_TIME)
              .subscribe(() => {
                this.zone.run(() => {
                  const windowInnerWidth = window.innerWidth;

                  if (windowInnerWidth >= MOBILE_SIZE) {
                    document.body.classList.remove('hideScroll');
                  }
                  this.setMarkersCoord(this.places);
                });
              });

          });
      }

      // app
        this.query = get(data, 'app.query', this.query);



      this.loaderService.setLoader(true);
    });

    this.getTranslationSubscribe = this.languageService.getTranslation('FAMILY').subscribe((trans: any) => {
      this.familyTranslate = trans;
    });
  }

  public createUrl(): string {
    let currency = '';
    if (this.timeUnit && this.currencyUnit) {
      currency = `&time=${this.timeUnit.code.toLowerCase()}&currency=${this.currencyUnit.code.toLowerCase()}`;
    }

    return `thing=${this.thing}${this.languageService.getLanguageParam()}${currency}`;
  }

  public urlChanged(options: {url: string, isNotReplaceState?: boolean}): void {
    const DEBOUNCE_TIME = 100;
    const {url, isNotReplaceState} = options;

    this.mapServiceSubscribe = this.mapService
      .getMainPlaces(url)
      .subscribe((res) => {
        if (res.err) {
          return;
        }

        this.places = res.data.places;
        this.countries = res.data.countries;

        this.query = url;

        if (!isNotReplaceState) {
          this.query = url;
          this.urlChangeService.replaceState('/map', this.createUrl());
        }

        this.setMarkersCoord(this.places);
        this.loaderService.setLoader(true);

        const resizeSubscribe = fromEvent(window, 'resize')
          .debounceTime(DEBOUNCE_TIME)
          .subscribe(() => {
            this.zone.run(() => {
              const windowInnerWidth = window.innerWidth;
              if (windowInnerWidth >= MOBILE_SIZE) {
                document.body.classList.remove('hideScroll');
              }
              this.setMarkersCoord(this.places);
            });
          });
      });
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.mapServiceSubscribe) {
      this.mapServiceSubscribe.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.loaderService) {
      this.loaderService.setLoader(false);
    }
  }

  public calcHoverPlaceIncome(): void {
    this.calcIncomeValue(this.hoverPlace);
  }

  public calcLeftSideIncome(): void {
    this.leftSideCountries = this.leftSideCountries.map((place: Place) => {
      return this.calcIncomeValue(place);
    });
  }

  private calcIncomeValue(place: Place): Place {
    if (this.timeUnit && this.currencyUnit) {
      place.showIncome = this.incomeCalcService
        .calcPlaceIncome(place.income, this.timeUnit.code, this.currencyUnit.value);
    } else {
      place.showIncome = this.math.round(place.income);
      this.currencyUnit = {} as Currency;
      this.currencyUnit.symbol = '$';
    }

    return place;
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

    this.calcLeftSideIncome();

    this.seeAllHomes = this.leftSideCountries.length > 1;

    this.places.forEach((place: Place, i: number) => {
      if (i !== index) {
        return;
      }
      this.hoverPlace = place;
      this.calcHoverPlaceIncome();
    });

    if (!this.hoverPlace) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (markerRef: ElementRef, i: number): void => {
      const marker: HTMLElement = markerRef.nativeElement as HTMLElement;
      if (i === index) {
        return;
      }
      marker.style.opacity = '0.3';
    });

    const img = new Image();

    const portraitBox = this.hoverPortrait.nativeElement as HTMLElement;
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
      const marker: HTMLElement = markerRef.nativeElement as HTMLElement;

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
    const infoBoxContainer = this.infoBoxContainer.nativeElement as HTMLElement;
    infoBoxContainer.scrollTop = 0;

    const el = e.target as HTMLElement;

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
    const windowInnerWidth = window.innerWidth;

    if (windowInnerWidth < MOBILE_SIZE) {
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

  public goToPage(params: UrlParameters): void {
    this.urlParametersService.dispatchToStore(params);
  }
}
