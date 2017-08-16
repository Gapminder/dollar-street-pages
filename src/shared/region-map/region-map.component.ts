import {
  Component,
  OnChanges,
  OnDestroy,
  Input,
  ElementRef,
  NgZone,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'region-map',
  templateUrl: './region-map.component.html',
  styleUrls: ['./region-map.component.css']
})
export class RegionMapComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('map')
  public map: ElementRef;
  @ViewChild('marker')
  public marker: ElementRef;

  @Input()
  public mapData: any;

  public markerPosition: any = {};
  public mapImage: HTMLImageElement;
  public element: HTMLElement;
  public zone: NgZone;
  public resizeSubscriber: Subscription;

  public constructor(zone: NgZone,
                     element: ElementRef) {
    this.zone = zone;
    this.element = element.nativeElement;
  }

  public ngAfterViewInit(): void {
    this.resizeSubscriber = fromEvent(window, 'resize')
      .subscribe(()=> {
        this.draw(this.mapData);
      });
  }

  public ngOnChanges(changes: any): void {
    if (changes.mapData) {
      this.draw(this.mapData);
    }
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  }

  public draw(place: any): void {
    let img = new Image();

    this.mapImage = this.map.nativeElement;

    img.onload = () => {
      this.zone.run(() => {
        this.drawMarker(place, this.mapImage);
      });
    };

    img.src = this.mapImage.src;
  }

  public drawMarker(place: any, mapImage: any): void {
    let marker = this.marker.nativeElement;

    let stepTop: number;
    let stepRight: number;
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

    let markerTop = equator - place.lat * stepTop - marker.offsetHeight + 'px';
    let markerLeft = place.lng * stepRight + greenwich - marker.offsetWidth / 2 + mapImage.offsetLeft + 'px';

    this.markerPosition = {top: markerTop, left: markerLeft};
    this.mapImage.src = this.getMapImage(place.region);
  }

  public getMapImage(region: string): string {
    let url: string;

    if (region === 'Africa') {
      url = '/assets/img/map-africa.png';
    }

    if (region === 'The Americas') {
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
