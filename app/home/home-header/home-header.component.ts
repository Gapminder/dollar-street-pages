import { Component, OnInit, Inject, OnDestroy, Input, NgZone, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscriber, Subscription } from 'rxjs/Rx';
import { RegionMapComponent } from '../../common/region-map/region-map.component';
import { Config } from '../../app.config';

let tpl = require('./home-header.template.html');
let style = require('./home-header.css');

@Component({
  selector: 'home-header',
  template: tpl,
  styles: [style],
  directives: [RegionMapComponent, ROUTER_DIRECTIVES]
})

export class HomeHeaderComponent implements OnInit, OnDestroy {
  protected home: any = {};
  protected mapData: any;
  protected math: any;
  protected isOpenArticle: boolean = false;
  protected familyShortInfoPosition: number = -88;
  protected isShowAboutData: boolean = false;
  protected isShowAboutDataFullScreen: boolean = false;
  protected aboutDataPosition: {left?: number;top?: number;} = {};
  protected windowHeight: number = window.innerHeight;
  protected maxHeightPopUp: number = this.windowHeight * .95 - 91;

  @Input('placeId')
  private placeId: string;
  private homeHeaderService: any;
  private homeHeaderServiceSubscribe: Subscriber<any>;
  private scrollSubscribe: Subscription;
  private resizeSubscribe: Subscription;
  private zone: NgZone;
  private element: HTMLElement;
  private headerElement: HTMLElement;
  private headerHeight: number;
  private headerContentHeight: number;

  public constructor(@Inject('HomeHeaderService') homeHeaderService: any,
                     @Inject(ElementRef) element: ElementRef,
                     @Inject('Math') math: any,
                     @Inject(NgZone) zone: NgZone) {
    this.homeHeaderService = homeHeaderService;
    this.zone = zone;
    this.math = math;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
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

    if (targetElement.className === 'short-about-info-image') {
      return;
    }

    event.preventDefault();

    this.animateScroll('scrollBackToTop', 20, 1000);
  }

  private animateScroll(id: string, inc: number, duration: number): any {
    const elem = document.getElementById(id);
    const startScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;

    window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  private goToScroll(step: number, duration: number, inc: number): any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }

      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  private incScrollTop(step: number): void {
    if (document.body.scrollTop) {
      document.body.scrollTop += step;
    } else {
      document.documentElement.scrollTop += step;
    }
  }
}
