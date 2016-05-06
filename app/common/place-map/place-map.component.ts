import {Component, OnInit, OnDestroy, Input, Inject, ElementRef, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';

let tpl = require('./place-map.template.html');
let style = require('./place-map.css');

@Component({
  selector: 'place-map',
  template: tpl,
  styles: [style]
})

export class PlaceMapComponent implements OnInit,OnDestroy {
  @Input()
  private hoverPlace:Observable<any>;

  private region:string;
  private markerPosition:any = {};
  private mapImage:any;
  private element:ElementRef;
  private zone:NgZone;
  private hoverPlaceSubscribe:any;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(NgZone) zone:NgZone) {
    this.element = element;
    this.zone = zone;
  }

  public ngOnInit():void {
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe((place:any) => {
        if (!place) {
          this.region = void 0;
          return;
        }
        let img = new Image();
        this.mapImage = this.element.nativeElement.querySelector('.map');

        img.onload = () => {
          this.zone.run(() => {
            this.drawMarker(place, this.mapImage);
          });
        };

        img.src = this.mapImage.src;
      });
  }

  public ngOnDestroy():void {
    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }
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

    let markerTop = equator - place.lat * stepTop - 5 + 'px';
    let markerLeft = place.lng * stepRight + greenwich - 6 + mapImage.offsetLeft + 'px';

    this.markerPosition = {top: markerTop, left: markerLeft};
    this.region = place.region.toLowerCase();
  }
}
