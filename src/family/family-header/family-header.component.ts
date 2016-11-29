import 'rxjs/operator/debounceTime';
import { Component, OnInit, OnDestroy, Input, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Config } from '../../app.config';
import { BrowserDetectionService, StreetSettingsService, DrawDividersInterface, MathService } from '../../common';
import { FamilyHeaderService } from './family-header.service';

@Component({
  selector: 'family-header',
  templateUrl: './family-header.component.html',
  styleUrls: ['./family-header.component.css']
})

export class FamilyHeaderComponent implements OnInit, OnDestroy {
  @Input('placeId')
  public placeId: string;

  @Output('familyExpandBlock')
  public familyExpandBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output('streetFamilyData')
  public streetFamilyData: EventEmitter<any> = new EventEmitter<any>();

  public home: any = {};
  public mapData: any;
  public math: MathService;
  public countryName: any;
  public isOpenArticle: boolean = false;
  public familyShortInfoPosition: number = -88;
  public isShowAboutData: boolean = false;
  public isShowAboutDataFullScreen: boolean = false;
  public aboutDataPosition: {left?: number;top?: number;} = {};
  public windowHeight: number = window.innerHeight;
  public maxHeightPopUp: number = this.windowHeight * .95 - 91;
  public familyHeaderService: FamilyHeaderService;
  public familyHeaderServiceSubscribe: Subscription;
  public scrollSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public zone: NgZone;
  public element: HTMLElement;
  public headerElement: HTMLElement;
  public headerHeight: number;
  public headerContentHeight: number;
  public streetSettingsService: StreetSettingsService;
  public streetData: DrawDividersInterface;
  public streetServiceSubscribe: Subscription;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;

  public constructor(zone: NgZone,
                     math: MathService,
                     element: ElementRef,
                     streetSettingsService: StreetSettingsService,
                     familyHeaderService: FamilyHeaderService,
                     browserDetectionService: BrowserDetectionService) {
    this.zone = zone;
    this.math = math;
    this.streetSettingsService = streetSettingsService;
    this.element = element.nativeElement;
    this.familyHeaderService = familyHeaderService;
    this.device = browserDetectionService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();
    this.isMobile = this.device.isMobile();
    this.headerElement = document.querySelector('.header-container') as HTMLElement;
    this.headerContentHeight = this.element.offsetHeight;

    this.familyHeaderServiceSubscribe = this.familyHeaderService
      .getFamilyHeaderData(`placeId=${this.placeId}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.home = res.data;
        this.streetFamilyData.emit({income: this.home.income, region: this.home.country.region});
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

        if (this.headerHeight !== this.headerElement.offsetHeight) {
          this.headerHeight = this.headerElement.offsetHeight;
        }

        this.zone.run(() => {
          if (scrollTop > this.element.offsetHeight - this.headerHeight && this.familyShortInfoPosition !== this.headerHeight) {
            this.familyShortInfoPosition = this.headerHeight;

            if (this.isMobile) {
              this.headerElement.classList.add('sub-panel-shown');
            }
          }

          if (scrollTop < this.element.offsetHeight - this.headerHeight && this.familyShortInfoPosition !== -this.headerHeight) {
            this.familyShortInfoPosition = -this.headerHeight;

            if (this.isMobile) {
              this.headerElement.classList.remove('sub-panel-shown');
            }
          }
        });
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
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
    this.familyHeaderServiceSubscribe.unsubscribe();

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  public openInfo(isOpenArticle: boolean): void {
    this.isOpenArticle = !isOpenArticle;
  }

  public closeAboutDataPopUp(event: MouseEvent): void {
    let el = event && event.target as HTMLElement;

    if (el.className.indexOf('closeMenu') !== -1) {
      this.isShowAboutData = false;
      this.isShowAboutDataFullScreen = false;
    }
  }

  public showAboutData(event: MouseEvent, fixed: boolean): void {
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

  public scrollToStart(event: MouseEvent): void {
    let targetElement = event.target as HTMLElement;
    let elementClassName: string = targetElement.className;

    if (elementClassName === 'short-about-info-image' || elementClassName === 'portrait') {
      return;
    }

    event.preventDefault();

    Config.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  }

  public truncCountryName(countryData: any): any {
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

  public openExpandBlock(): void {
    this.familyExpandBlock.emit({thingId: this.home.familyThingId});
  }
}
