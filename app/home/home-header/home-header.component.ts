import { Component, OnInit, Inject, OnDestroy, Input, NgZone, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { PlaceMapComponent } from '../../common/place-map/place-map.component';
import { RegionMapComponent } from '../../common/region-map/region-map.component';

let tpl = require('./home-header.template.html');
let style = require('./home-header.css');

@Component({
  selector: 'home-header',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, RegionMapComponent, RouterLink]
})

export class HomeHeaderComponent implements OnInit, OnDestroy {
  protected home:any = {};
  protected mapData:any;
  protected math:any;
  protected isOpenArticle:boolean = false;
  protected familyShortInfoPosition:number = -88;
  protected isShowAboutData:boolean = false;
  protected isShowAboutDataFullScreen:boolean = false;
  protected aboutDataPosition:{left?:number;top?:number;} = {};
  protected windowHeight:number = window.innerHeight;
  protected maxHeightPopUp:number = this.windowHeight * .95 - 91;

  @Input('placeId')
  private placeId:string;
  private homeHeaderService:any;
  private homeHeaderServiceSubscribe:any;
  private scrollSubscribe:any;
  private resizeSubscribe:any;
  private zone:NgZone;
  private element:ElementRef;

  public constructor(@Inject('HomeHeaderService') homeHeaderService:any,
                     @Inject(ElementRef) element:ElementRef,
                     @Inject('Math') math:any,
                     @Inject(NgZone) zone:NgZone) {
    this.homeHeaderService = homeHeaderService;
    this.zone = zone;
    this.math = math;
    this.element = element;
  }

  public ngOnInit():void {
    this.homeHeaderServiceSubscribe = this.homeHeaderService
      .getHomeHeaderData(`placeId=${this.placeId}`)
      .subscribe((res:any):any => {
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
          if (scrollTop > 200) {
            this.familyShortInfoPosition = 88;
          } else {
            this.familyShortInfoPosition = -88;
          }
        });
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowHeight = window.innerHeight;
          this.maxHeightPopUp = this.windowHeight * .95 - 91;
        });
      });
  }

  public ngOnDestroy():void {
    this.homeHeaderServiceSubscribe.unsubscribe();

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  protected openInfo(isOpenArticle:boolean):void {
    this.isOpenArticle = !isOpenArticle;
  }

  protected closeAboutDataPopUp(event:MouseEvent):void {
    let el = event && event.target as HTMLElement;

    if (el.className.indexOf('closeMenu') !== -1) {
      this.isShowAboutData = false;
      this.isShowAboutDataFullScreen = false;
    }
  }

  protected showAboutData(event:MouseEvent, fixed:boolean):void {
    if (!arguments.length) {
      this.isShowAboutData = false;

      return;
    }

    if (fixed) {
      this.isShowAboutData = true;
      this.isShowAboutDataFullScreen = true;

      return;
    }

    let aboutDataContainer:HTMLElement = this.element.nativeElement.querySelector('.about-data-container');

    let position = this.getCoords(event.target);

    this.aboutDataPosition.left = position.left - aboutDataContainer.clientWidth + 28;
    this.aboutDataPosition.top = position.top + 28;

    this.isShowAboutData = true;
  }

  protected getCoords(element:any):{left:number; top:number} {
    let box = element.getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;

    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;

    return {left: Math.round(left), top: Math.round(top)};
  }
}
