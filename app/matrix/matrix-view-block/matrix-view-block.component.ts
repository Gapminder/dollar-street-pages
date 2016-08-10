import { Component, Input, Output, OnInit, OnChanges, Inject, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscriber, Subscription } from 'rxjs/Rx';
import { RegionMapComponent } from '../../common/region-map/region-map.component';

let tpl = require('./matrix-view-block.template.html');
let style = require('./matrix-view-block.css');

@Component({
  selector: 'matrix-view-block',
  template: tpl,
  styles: [style],
  directives: [RegionMapComponent, ROUTER_DIRECTIVES]
})

export class MatrixViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  public familyInfoServiceSubscribe: Subscriber<any>;
  public fancyBoxImage: any;

  protected showblock: boolean;
  protected familyData: any = {};
  protected loader: boolean = false;
  protected math: any;
  protected markerPositionLeft: number;

  @Input('positionInRow')
  protected positionInRow: any;

  private privateZoom: any;
  private resizeSubscribe: Subscription;
  private popIsOpen: boolean;
  private mapData: any;
  private familyInfoService: any;
  private zone: NgZone;
  private router: Router;
  private containerPadding: number;
  private widthScroll: number;

  @Input('query')
  private query: any;
  @Input('place')
  private place: any;
  @Input('thing')
  private thing: string;
  @Output('closeBigImageBlock')
  private closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  public constructor(@Inject('FamilyInfoService') familyInfoService: any,
                     @Inject('Math') math: any,
                     @Inject(NgZone) zone: NgZone,
                     @Inject(Router) router: Router) {
    this.familyInfoService = familyInfoService;
    this.zone = zone;
    this.router = router;
    this.math = math;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          let imageWidth: number = (window.innerWidth - 34 - this.containerPadding * 2 - this.widthScroll) / this.privateZoom;

          this.markerPositionLeft = imageWidth * (this.positionInRow || this.privateZoom) - (imageWidth / 2 + 16);
        });
      });
  }

  public ngOnChanges(): void {
    this.loader = false;
    this.showblock = true;

    let url = `placeId=${this.place._id}&thingId=${this.thing}`;
    let parseUrl: any = this.parseUrl(`place=${this.place._id}&` + this.query.replace(/&activeHouse\=\d*/, ''));
    this.privateZoom = parseUrl.zoom;

    setTimeout(() => {
      this.widthScroll = window.innerWidth - document.body.offsetWidth;

      let imagesContainer = document.querySelector('.flex-container') as HTMLElement;
      let paddingLeft: string = window.getComputedStyle(imagesContainer).getPropertyValue('padding-left');
      this.containerPadding = parseFloat(paddingLeft);

      let imageWidth: number = (window.innerWidth - 34 - this.containerPadding * 2 - this.widthScroll) / this.privateZoom;

      this.markerPositionLeft = imageWidth * (this.positionInRow || this.privateZoom) - (imageWidth / 2 + 16);
    }, 0);

    this.place.background = this.place.background.replace('devices', 'desktops');
    this.mapData = {region: this.place.region, lat: this.place.lat, lng: this.place.lng};

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    this.familyInfoServiceSubscribe = this.familyInfoService.getFamilyInfo(url)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.familyData = res.data;

        if (this.familyData.familyData && this.familyData.familyData.length > 300) {
          this.familyData.familyData = this.familyData.familyData.slice(0, 300) + '...';
        }

        this.familyData.goToPlaceData = parseUrl;
        this.loader = true;
      });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }
  }

  protected closeBlock(): void {
    this.closeBigImageBlock.emit({});
  }

  protected openPopUp(): void {
    this.popIsOpen = true;

    let imgUrl = this.place.background.replace('desktops', 'original');
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = 'url("' + imgUrl + '")';
      });
    };

    newImage.src = imgUrl;
  };

  protected fancyBoxClose(): void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  private parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
