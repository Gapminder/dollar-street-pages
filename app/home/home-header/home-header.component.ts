import { Component, OnInit, OnDestroy, Input, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription, Observable } from 'rxjs/Rx';
import { Config } from '../../app.config';
import { MathService } from '../../common/math-service/math-service';
import { HomeHeaderService } from './home-header.service';
import { StreetSettingsService, DrawDividersInterface } from '../../common/street/street.settings.service';
import { BrowserDetectionService } from '../../common/browser-detection/browser-detection.service';

@Component({
  selector: 'home-header',
  templateUrl: './home-header.template.html',
  styleUrls: ['./home-header.css']
})

export class HomeHeaderComponent implements OnInit, OnDestroy {
  @Input('placeId')
  private placeId: string;

  @Output('familyExpandBlock')
  private familyExpandBlock: EventEmitter<any> = new EventEmitter<any>();

  private home: any = {};
  private mapData: any;
  private math: MathService;
  private countryName: any;
  private isOpenArticle: boolean = false;
  private familyShortInfoPosition: number = -88;
  private isShowAboutData: boolean = false;
  private isShowAboutDataFullScreen: boolean = false;
  private aboutDataPosition: {left?: number;top?: number;} = {};
  private windowHeight: number = window.innerHeight;
  private maxHeightPopUp: number = this.windowHeight * .95 - 91;
  private homeHeaderService: HomeHeaderService;
  private homeHeaderServiceSubscribe: Subscription;
  private scrollSubscribe: Subscription;
  private resizeSubscribe: Subscription;
  private zone: NgZone;
  private element: HTMLElement;
  private headerElement: HTMLElement;
  private headerHeight: number;
  private headerContentHeight: number;
  private streetSettingsService: StreetSettingsService;
  private streetData: DrawDividersInterface;
  private streetServiceSubscribe: Subscription;
  private device: BrowserDetectionService;
  private isDesktop: boolean;

  public constructor(zone: NgZone,
                     math: MathService,
                     element: ElementRef,
                     streetSettingsService: StreetSettingsService,
                     homeHeaderService: HomeHeaderService,
                     browserDetectionService: BrowserDetectionService) {
    this.homeHeaderService = homeHeaderService;
    this.zone = zone;
    this.math = math;
    this.streetSettingsService = streetSettingsService;
    this.element = element.nativeElement;
    this.homeHeaderService = homeHeaderService;
    this.device = browserDetectionService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();
    this.headerElement = document.querySelector('.header-container') as HTMLElement;
    this.headerHeight = this.headerElement.offsetHeight;
    this.headerContentHeight = this.element.offsetHeight;

    this.homeHeaderServiceSubscribe = this.homeHeaderService
      .getHomeHeaderData(`placeId=${this.placeId}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.home = res.data;
        this.mapData = this.home.country;
        this.truncCountryName(this.home.country);
      });

    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.streetData = res.data;
      });

    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        this.zone.run(() => {
          if (scrollTop > this.element.offsetHeight - this.headerHeight) {
            this.familyShortInfoPosition = this.headerHeight;
          } else {
            this.familyShortInfoPosition = -this.headerHeight;
          }
        });
      });

    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowHeight = window.innerHeight;
          this.maxHeightPopUp = this.windowHeight * .95 - 91;
          this.headerHeight = this.headerElement.offsetHeight;
          this.headerContentHeight = this.element.offsetHeight;
        });
      });
  }

  public ngOnDestroy(): void {
    this.homeHeaderServiceSubscribe.unsubscribe();

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  protected openInfo(isOpenArticle: boolean): void {
    this.isOpenArticle = !isOpenArticle;
  }

  protected closeAboutDataPopUp(event: MouseEvent): void {
    let el = event && event.target as HTMLElement;

    if (el.className.indexOf('closeMenu') !== -1) {
      this.isShowAboutData = false;
      this.isShowAboutDataFullScreen = false;
    }
  }

  protected showAboutData(event: MouseEvent, fixed: boolean): void {
    if (fixed) {
      event.preventDefault();
    }

    if (!arguments.length) {
      this.isShowAboutData = false;

      return;
    }

    if (fixed) {
      this.isShowAboutData = true;
      this.isShowAboutDataFullScreen = true;

      return;
    }

    let aboutDataContainer = this.element.querySelector('.about-data-container') as HTMLElement;
    let targetElement = event.target as HTMLElement;

    Config.getCoordinates(`.${targetElement.className}`, (data: any) => {
      this.aboutDataPosition.left = data.left - aboutDataContainer.clientWidth + 28;
      this.aboutDataPosition.top = data.top + 28;

      this.isShowAboutData = true;
    });
  }

  protected scrollToStart(event: MouseEvent): void {
    let targetElement = event.target as HTMLElement;
    let elementClassName: string = targetElement.className;

    if (elementClassName === 'short-about-info-image' || elementClassName === 'portrait') {
      return;
    }

    event.preventDefault();

    Config.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  }

  protected truncCountryName(countryData: any): any {
    switch (countryData.alias) {
      case 'South Africa' :
        this.countryName = 'SA';
        break;
      case 'United States' :
        this.countryName = 'USA';
        break;
      case 'United Kingdom' :
        this.countryName = 'UK';
        break;
      default :
        if (countryData.alias.length > 10) {
          this.countryName = countryData.alias.slice(0, 8) + '...';
        } else {
          this.countryName = countryData.alias;
        }
    }
  }

  protected openExpandBlock(): void {
    this.familyExpandBlock.emit({thingId: this.home.familyThingId});
  }
}
