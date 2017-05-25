import 'rxjs/add/operator/debounceTime';

import { Component, OnInit, OnDestroy, ElementRef, NgZone, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

import {
  MathService,
  LoaderService,
  UrlChangeService,
  Angulartics2GoogleAnalytics,
  StreetSettingsService,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService
} from '../common';
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
  public queryParamsSubscribe: Subscription;
  public streetServiceSubscribe: Subscription;
  public isDesktop: boolean;
  public isMobile: boolean;
  public hoverPlace: any = void 0;
  public hoverPortraitTop: any;
  public currentCountry: string;
  public onMarker: boolean = false;
  public isOpenLeftSide: boolean = false;
  public originCurrentCountry: string;

  private resizeSubscribe: Subscription;
  private mapServiceSubscribe: Subscription;
  private math: MathService;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private mapService: MapService;
  private countries: any[] = [];
  private element: any;
  private hoverPortraitLeft: any;
  private thing: any;
  private urlChangeService: UrlChangeService;
  private query: string;
  private leftSideCountries: any;
  private seeAllHomes: boolean = false;
  private leftArrowTop: any;
  private onThumb: boolean = false;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private zone: NgZone;
  private shadowClass: {'shadow_to_left': boolean, 'shadow_to_right': boolean};
  private loaderService: LoaderService;
  private streetData: DrawDividersInterface;
  private streetSettingsService: StreetSettingsService;
  private windowInnerWidth: number = window.innerWidth;
  private device: BrowserDetectionService;
  private languageService: LanguageService;

  public constructor(zone: NgZone,
                     router: Router,
                     math: MathService,
                     element: ElementRef,
                     mapService: MapService,
                     loaderService: LoaderService,
                     activatedRoute: ActivatedRoute,
                     urlChangeService: UrlChangeService,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     languageService: LanguageService) {
    this.zone = zone;
    this.math = math;
    this.router = router;
    this.mapService = mapService;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.device = browserDetectionService;
    this.urlChangeService = urlChangeService;
    this.streetSettingsService = streetSettingsService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();
    this.isMobile = this.device.isMobile();

    let isInit: boolean = true;
    this.loaderService.setLoader(false);

    this.getTranslationSubscribe = this.languageService.getTranslation('FAMILY').subscribe((trans: any) => {
      this.familyTranslate = trans;
    });

    this.queryParamsSubscribe = this.activatedRoute
      .queryParams
      .subscribe((params: {thing: string}) => {
        this.thing = params.thing ? params.thing : 'Families';
        let query: any = {url: `thing=${this.thing}${this.languageService.getLanguageParam()}`};

        if (!params.thing || (params.thing && !isInit)) {
          query.isNotReplaceState = true;
        }

        this.urlChanged(query);
        isInit = false;
      });

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
      });
  }

  public urlChanged(options: {url: string, isNotReplaceState?: any}): void {
    let {url, isNotReplaceState} = options;

    this.mapServiceSubscribe = this.mapService.getMainPlaces(url)
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

    if (this.windowInnerWidth < 600) {
      document.body.classList.add('hideScroll');
    }
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
