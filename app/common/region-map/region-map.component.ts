import { Component, OnInit, OnChanges, OnDestroy, Input, Inject, ElementRef, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';

let tpl = require('./region-map.template.html');
let style = require('./region-map.css');

@Component({
  selector: 'region-map',
  template: tpl,
  styles: [style]
})

export class RegionMapComponent implements OnInit, OnChanges, OnDestroy {
  @Input('mapData')
  private mapData:any;

  private markerPosition:any = {};
  private mapImage:any;
  private element:ElementRef;
  private zone:NgZone;
  private resizeSubscriber:any;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(NgZone) zone:NgZone) {
    this.element = element;
    this.zone = zone;
  }

  public ngOnInit():void {
    this.resizeSubscriber = fromEvent(window, 'resize').subscribe(()=> {
      this.draw(this.mapData);
    });
  }

  public ngOnChanges(changes:any):void {
    if (changes.mapData) {
      this.draw(this.mapData);
    }
  }

  public ngOnDestroy():void {
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  }

  public draw(place:any):void {
    let img = new Image();

    this.mapImage = this.element.nativeElement.querySelector('.map');

    img.onload = () => {
      this.zone.run(() => {
        this.drawMarker(place, this.mapImage);
      });
    };

    img.src = this.mapImage.src;
  }

  public drawMarker(place:any, mapImage:any):void {
    let stepTop;
    let stepRight;
    let widthOfMap = mapImage.offsetWidth;
    let heightOfMap = mapImage.offsetHeight;
    let greenwich = widthOfMap * 0.437;
    let equator = heightOfMap * 0.545;

    if (place.lat > 0) {
      stepTop = equator / 75;
    } else {
      stepTop = (heightOfMap - equator) / 75;
    }

    if (place.lng < 0) {
      stepRight = greenwich / 130;
    } else {
      stepRight = (widthOfMap - greenwich) / 158;
    }

    let markerTop = equator - place.lat * stepTop - 24 + 'px';
    let markerLeft = place.lng * stepRight + greenwich - 7.5 + mapImage.offsetLeft + 'px';

    this.markerPosition = {top: markerTop, left: markerLeft};
    this.mapImage.src = this.getMapImage(place.region);
  }

  private getMapImage(region:string):string {
    let url:string;

    if (region === 'Africa') {
      url = '/assets/img/map-africa.png';
    }

    if (region === 'America') {
      url = '/assets/img/map-america.png';
    }

    if (region === 'Asia') {
      url = '/assets/img/map-asia.png';
    }

    if (region === 'Europe') {
      url = '/assets/img/map-europe.png';
    }

    return url;
  }
}
