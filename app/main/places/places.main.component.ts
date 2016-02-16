import {Component, OnInit, Inject, ElementRef} from 'angular2/core';
import {MainPlacesService} from './main.places.service';

let tpl = require('./places.main.component.html');
let style = require('./places.main.component.css');

@Component({
  selector: 'places-main',
  template: tpl,
  styles: [style]
})

export class PlacesMainComponent implements OnInit {
  private placeService:MainPlacesService;
  private places:any[] = [];
  private element:any;
  private map:HTMLElement;
  private hoverPlace:any = null;
  private markers:any;
  private hoverPortraitTop:any;
  private hoverPortraitLeft:any;


  constructor(@Inject(MainPlacesService) placeService,
              @Inject(ElementRef) element) {
    this.placeService = placeService;
    this.element = element;
  }

  ngOnInit():void {
    this.placeService.getMainPlaces()
      .subscribe((res)=> {
        if (res.err) {
          return res.err;
        }
        this.map = this.element.nativeElement.querySelector('.mapBox');
        this.setMarkersCoord(res.places)
        this.places = res.places;
      });
  }


  setMarkersCoord(places) {
    let width = this.map.offsetWidth;
    let height = this.map.offsetHeight;
    let greenwich = 0.439 * width;
    let equator = 0.545 * height;

    places.forEach((place:any)=> {
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
  }

  private hoverOnMarker(index):void {
    this.markers = this.map.querySelectorAll('.marker');
    this.places.forEach((place, i) => {
      if (i !== index) {
        return;
      }

      this.hoverPlace = place;
    });
    Array.prototype.forEach.call(this.markers, (marker, i)=> {
      if (i === index) {
        return;
      }
      marker.style.opacity = 0.3;
    });

    if (this.hoverPlace) {
      let img = new Image();

      let portraitBox = this.map.querySelector('.hover_portrait') as HTMLElement;
      portraitBox.style.opacity = '0';

      img.onload = ()=> {
        this.hoverPortraitTop = this.hoverPlace.top - portraitBox.offsetWidth - 40;
        this.hoverPortraitLeft = this.hoverPlace.left - portraitBox.offsetHeight / 2 + 27;
        portraitBox.style.opacity = '1';

      };

      img.src = this.hoverPlace.familyImg.background;
    }
  }

  private unHoverOnMarker():void{
    this.hoverPlace = null;
    this.hoverPortraitTop = null;
    this.hoverPortraitLeft = null;
    Array.prototype.forEach.call(this.markers, (marker, i)=> {
      marker.style.opacity = '1';
    });
    this.markers=null;
  }


  private hoverOnFamily(index):void {
    this.markers = this.map.querySelectorAll('.marker');
    Array.prototype.forEach.call(this.markers, (marker, i)=> {
      if (i === index) {
        return;
      }

      marker.style.opacity = '0.3';
    });
  };

  private unHoverOnFamily ():void{
    Array.prototype.forEach.call(this.markers, (marker)=> {
      marker.style.opacity = '1';
    });
    this.markers=null;
  };
}
