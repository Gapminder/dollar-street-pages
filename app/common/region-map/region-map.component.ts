import { Component, OnInit, OnChanges, OnDestroy, Input, ElementRef, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';

@Component({
  selector: 'region-map',
  templateUrl: './region-map.template.html',
  styleUrls: ['./region-map.css']
})

export class RegionMapComponent implements OnInit, OnChanges, OnDestroy {
  protected markerPosition: any = {};

  @Input('mapData')
  private mapData: any;

  private mapImage: HTMLImageElement;
  private element: HTMLElement;
  private zone: NgZone;
  private resizeSubscriber: Subscription;

  public constructor(zone: NgZone,
                     element: ElementRef) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
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

    this.mapImage = this.element.querySelector('.map') as HTMLImageElement;

    img.onload = () => {
      this.zone.run(() => {
        this.drawMarker(place, this.mapImage);
      });
    };

    img.src = this.mapImage.src;
  }

  public drawMarker(place: any, mapImage: any): void {
    let stepTop;
    let stepRight;
    let widthOfMap = mapImage.offsetWidth;
    let heightOfMap = mapImage.offsetHeight;
    let greenwich = widthOfMap * 0.437;
    let equator = heightOfMap * 0.545;
    let marker = this.element.querySelector('.marker') as HTMLImageElement;

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

  private getMapImage(region: string): string {
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
