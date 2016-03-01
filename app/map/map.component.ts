import {Component, OnInit, Inject, ElementRef} from 'angular2/core';
import {RouterLink, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs/Rx';

import {UrlChangeService} from '../common/url-change/url-change.service';
import {MapService} from './map.service.ts';
import {HeaderComponent} from '../common/header/header.component';

let tpl = require('./map.html');
let style = require('./map.component.css');

let device = require('device.js')();
const isDesktop = device.desktop();

@Component({
  selector: 'map-component',
  template: tpl,
  styles: [style],
  directives: [RouterLink, HeaderComponent]
})

export class MapComponent implements OnInit {
  private mapService:MapService;
  private places:any[] = [];
  private countries:any[] = [];
  private element:any;
  private map:HTMLImageElement;
  private hoverPlace:any = null;
  private markers:any;
  private hoverPortraitTop:any;
  private hoverPortraitLeft:any;
  private thing:any;
  private urlChangeService:UrlChangeService;
  private query:string;
  private routeParams:any;

  constructor(@Inject(MapService) placeService,
              @Inject(ElementRef) element,
              @Inject(RouteParams) routeParams,
              @Inject(UrlChangeService) urlChangeService) {
    this.mapService = placeService;
    this.element = element;
    this.routeParams = routeParams;
    this.urlChangeService = urlChangeService;
  }

  ngOnInit():void {
    this.thing = this.routeParams.get('thing');
    this.urlChanged(this.thing)
  }

  urlChanged(thing:any) {
    this.thing = thing;
    let query = '';
    if (thing && thing._id) {
      query = `thing=${this.thing._id}`;
    }

    this.mapService.getMainPlaces(query)
      .subscribe((res)=> {
        if (res.err) {
          return res.err;
        }

        this.map = this.element.nativeElement.querySelector('.mapBox');
        this.places = res.data.places;
        this.query=`thing=${res.data.thing}`;

        this.urlChangeService.replaceState('/map', this.query);
        this.countries = res.data.countries;
        this.setMarkersCoord(this.places);

        Observable
          .fromEvent(window, 'resize')
          .debounceTime(150)
          .subscribe(() => {
            this.setMarkersCoord(this.places);
          });
      });
  }

  setMarkersCoord(places) {
    let img = new Image();
    let mapImage = this.element.nativeElement.querySelector('.map');

    img.onload = () => {
      let width = mapImage.offsetWidth;
      let height = mapImage.offsetHeight;
      let greenwich = 0.439 * width;
      let equator = 0.545 * height;

      places.forEach((place:any) => {
        let stepTop, stepRight;

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

  private hoverOnMarker(index):void {
    if (!isDesktop) {
      return;
    }

    this.markers = this.map.querySelectorAll('.marker');

    this.places.forEach((place, i) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });
    if (!this.hoverPlace) {
      return
    }
    Array.prototype.forEach.call(this.markers, (marker, i)=> {
      if (i === index) {
        return;
      }

      marker.style.opacity = 0.3;
    });

    let img = new Image();

    let portraitBox = this.map.querySelector('.hover_portrait') as HTMLElement;
    portraitBox.style.opacity = '0';

    img.onload = ()=> {
      if (!this.hoverPlace) {
        return;
      }
      this.hoverPortraitTop = this.hoverPlace.top - portraitBox.offsetWidth - 40;
      this.hoverPortraitLeft = this.hoverPlace.left - portraitBox.offsetHeight / 2 + 27;

      portraitBox.style.opacity = '1';
    };

    img.src = this.hoverPlace.familyImg.background;
  }

  private unHoverOnMarker():void {
    if (!isDesktop) {
      return;
    }

    this.hoverPlace = null;
    this.hoverPortraitTop = null;
    this.hoverPortraitLeft = null;

    Array.prototype.forEach.call(this.markers, (marker) => {
      marker.style.opacity = '1';
    });

    this.markers = null;
  }


  private hoverOnFamily(index):void {
    if (!isDesktop) {
      return;
    }

    this.markers = this.map.querySelectorAll('.marker');

    Array.prototype.forEach.call(this.markers, (marker, i) => {
      if (i === index) {
        return;
      }

      marker.style.opacity = '0.3';
    });
  };

  private unHoverOnFamily():void {
    if (!isDesktop) {
      return;
    }

    Array.prototype.forEach.call(this.markers, (marker) => {
      marker.style.opacity = '1';
    });

    this.markers = null;
  };
}
