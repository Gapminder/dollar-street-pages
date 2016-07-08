import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { fromEvent } from 'rxjs/observable/fromEvent';

let tpl = require('./places.main.template.html');
let style = require('./places.main.css');

let device = require('device.js')();
const isDesktop = device.desktop();

@Component({
  selector: 'places-main',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class PlacesMainComponent implements OnInit, OnDestroy {
  private placeService:any;
  private places:any[] = [];
  private element:any;
  private map:HTMLImageElement;
  private hoverPlace:any = void 0;
  private markers:any;
  private hoverPortraitTop:any;
  private hoverPortraitLeft:any;
  private resizeSubscribe:any;
  private placeServiceSubscribe:any;

  public constructor(@Inject('MainPlacesService') placeService:any,
                     @Inject(ElementRef) element:ElementRef) {
    this.placeService = placeService;
    this.element = element;
  }

  public ngOnInit():void {
    this.placeServiceSubscribe = this.placeService.getMainPlaces()
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.map = this.element.nativeElement.querySelector('.mapBox');

        this.places = res.places;
        this.setMarkersCoord(this.places);

        this.resizeSubscribe = fromEvent(window, 'resize')
          .debounceTime(150)
          .subscribe(() => {
            this.setMarkersCoord(this.places);
          });
      });
  }

  public ngOnDestroy():void {
    this.resizeSubscribe.unsubscribe();
    this.placeServiceSubscribe.unsubscribe();
  }

  protected hoverOnMarker(index:any):void {
    if (!isDesktop) {
      return;
    }

    this.markers = this.map.querySelectorAll('.marker');

    this.places.forEach((place:any, i:any) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });

    Array.prototype.forEach.call(this.markers, (marker:any, i:any) => {
      if (i === index) {
        return;
      }

      marker.style.opacity = 0.3;
    });

    if (this.hoverPlace) {
      let img = new Image();

      let portraitBox = this.map.querySelector('.hover_portrait') as HTMLElement;
      portraitBox.style.opacity = '0';

      img.onload = () => {
        this.hoverPortraitTop = this.hoverPlace.top - portraitBox.offsetWidth - 40;
        this.hoverPortraitLeft = this.hoverPlace.left - portraitBox.offsetHeight / 2 + 27;

        portraitBox.style.opacity = '1';
      };

      img.src = this.hoverPlace.familyImg.background;
    }
  }

  protected unHoverOnMarker():void {
    if (!isDesktop) {
      return;
    }

    this.hoverPlace = void 0;
    this.hoverPortraitTop = void 0;
    this.hoverPortraitLeft = void 0;

    Array.prototype.forEach.call(this.markers, (marker:any) => {
      marker.style.opacity = '1';
    });

    this.markers = void 0;
  }

  protected hoverOnFamily(index:any):void {
    if (!isDesktop) {
      return;
    }

    this.markers = this.map.querySelectorAll('.marker');

    Array.prototype.forEach.call(this.markers, (marker:any, i:any) => {
      if (i === index) {
        return;
      }

      marker.style.opacity = '0.3';
    });
  };

  protected unHoverOnFamily():void {
    if (!isDesktop) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (marker:any) => {
      marker.style.opacity = '1';
    });

    this.markers = void 0;
  };

  private setMarkersCoord(places:any):void {
    let img = new Image();
    let mapImage = this.element.nativeElement.querySelector('.map');

    img.onload = () => {
      let width = mapImage.offsetWidth;
      let height = mapImage.offsetHeight;
      let greenwich = 0.439 * width;
      let equator = 0.545 * height;

      places.forEach((place:any) => {
        let stepTop;
        let stepRight;

        if (place.lat > 0) {
          stepTop = equator / 75;
        } else {
          stepTop = (height - equator) / 75;
        }

        if (place.lng < 0) {
          stepRight = greenwich / 130;
        } else {
          stepRight = (width - greenwich) / 158;
        }

        place.left = place.lng * stepRight + greenwich;
        place.top = equator - place.lat * stepTop - 23;
      });
    };

    img.src = mapImage.src;
  }
}
