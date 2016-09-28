import { Component, OnInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { MathService } from '../common/math-service/math-service';
import { MapService } from './map.service';
import { LoaderService } from '../common/loader/loader.service';
import { UrlChangeService } from '../common/url-change/url-change.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

let tpl = require('./map.template.html');
let style = require('./map.css');

let device = require('device.js')();

@Component({
  selector: 'map-component',
  template: tpl,
  styles: [style]
})

export class MapComponent implements OnInit, OnDestroy {
  private resizeSubscribe: Subscription;
  private mapServiceSubscribe: Subscription;
  private math: MathService;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private mapService: MapService;
  private places: any[] = [];
  private countries: any[] = [];
  private element: any;
  private map: HTMLImageElement;
  private hoverPlace: any = void 0;
  private markers: any;
  private hoverPortraitTop: any;
  private hoverPortraitLeft: any;
  private thing: any;
  private urlChangeService: UrlChangeService;
  private query: string;
  private currentCountry: string;
  private leftSideCountries: any;
  private seeAllHomes: boolean = false;
  private leftArrowTop: any;
  private onThumb: boolean = false;
  private onMarker: boolean = false;
  private isOpenLeftSide: boolean = false;
  private init: boolean;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private isDesktop: boolean = device.desktop();
  private isMobile: boolean = device.mobile();
  private zone: NgZone;
  private shadowClass: {'shadow_to_left': boolean, 'shadow_to_right': boolean};
  private queryParamsSubscribe: Subscription;
  private loaderService: LoaderService;
  private windowInnerWidth: number = window.innerWidth;

  public constructor(zone: NgZone,
                     router: Router,
                     math: MathService,
                     element: ElementRef,
                     mapService: MapService,
                     loaderService: LoaderService,
                     activatedRoute: ActivatedRoute,
                     urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.zone = zone;
    this.math = math;
    this.router = router;
    this.mapService = mapService;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.urlChangeService = urlChangeService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  public ngOnInit(): void {
    this.init = true;
    this.loaderService.setLoader(false);

    this.queryParamsSubscribe = this.activatedRoute
      .queryParams
      .subscribe((params: any) => {
        this.thing = params.thing ? params.thing : 'Families';
        this.urlChanged({url: `thing=${this.thing}`});
      });
  }

  public urlChanged(options: any): void {
    this.mapServiceSubscribe = this.mapService.getMainPlaces(options.url)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.places = res.data.places;
        this.countries = res.data.countries;
        this.map = this.element.querySelector('.mapBox');
        this.query = `thing=${res.data.thing}`;
        this.urlChangeService.replaceState('/map', this.query);
        this.setMarkersCoord(this.places);
        this.loaderService.setLoader(true);

        this.resizeSubscribe = Observable
          .fromEvent(window, 'resize')
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
    this.resizeSubscribe.unsubscribe();
    this.mapServiceSubscribe.unsubscribe();
    this.queryParamsSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }

  public setMarkersCoord(places: any): void {
    let img = new Image();
    let mapImage: HTMLImageElement = this.element.querySelector('.map-color');

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

  public hoverOnMarker(index: number, country: any): void {
    if (!this.isDesktop) {
      return;
    }

    if (this.isOpenLeftSide) {
      return;
    }

    this.onMarker = true;
    this.currentCountry = country;

    this.leftSideCountries = this.places.filter((place: any): boolean => {
      return place.country === this.currentCountry;
    });

    this.seeAllHomes = this.leftSideCountries.length > 1;

    this.markers = this.map.querySelectorAll('.marker');

    this.places.forEach((place: any, i: number) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });

    if (!this.hoverPlace) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (marker: HTMLElement, i: number): void => {
      if (i === index) {
        return;
      }

      marker.style.opacity = '0.3';
    });

    let img = new Image();

    let portraitBox = this.map.querySelector('.hover_portrait') as HTMLElement;
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

  public hoverOnMarkerTablet(index: number, country: any): void {
    if (this.isMobile || this.isDesktop) {
      return;
    }

    if (this.isOpenLeftSide) {
      return;
    }

    this.onMarker = true;
    this.currentCountry = country;

    this.leftSideCountries = this.places.filter((place: any): boolean => {
      return place.country === this.currentCountry;
    });

    this.seeAllHomes = this.leftSideCountries.length > 1;

    this.markers = this.map.querySelectorAll('.marker');

    this.places.forEach((place: any, i: number) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });

    if (!this.hoverPlace) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (marker: HTMLElement, i: number): void => {
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

      Array.prototype.forEach.call(this.markers, (marker: HTMLElement): void => {
        marker.style.opacity = '1';
      });

      this.seeAllHomes = false;
      this.hoverPlace = void 0;
      this.hoverPortraitTop = void 0;
      this.hoverPortraitLeft = void 0;
      this.markers = void 0;
    }, 300);
  }

  public openLeftSideBar(): void {
    this.isOpenLeftSide = true;

    if (this.windowInnerWidth < 600) {
      document.body.classList.add('hideScroll');
    }
  }

  public closeLeftSideBar(e: MouseEvent): void {
    let infoBoxContainer = this.element.querySelector('.info-box-container') as HTMLElement;
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

  public clickOnMarker(e: MouseEvent, index: number, country: any): void {
    if (this.isOpenLeftSide) {
      this.isOpenLeftSide = !this.isOpenLeftSide;

      this.closeLeftSideBar(e);
      this.hoverOnMarker(index, country);

      return;
    }

    if (this.leftSideCountries && this.leftSideCountries.length === 1) {
      this.angulartics2GoogleAnalytics
        .eventTrack(`Look at ${this.hoverPlace.family} place from ${this.hoverPlace.country} with map page`, {});
      this.router.navigate(['/family'], {queryParams: {place: this.hoverPlace._id}});
    }
  }

  public mobileClickOnMarker(country: any): void {
    this.currentCountry = country;

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
