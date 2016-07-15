import { Component, OnInit, OnDestroy, Input, Output, Inject, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { RouterLink, RouteParams } from '@angular/router-deprecated';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { zip } from 'rxjs/observable/zip';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PlaceMapComponent } from '../../common/place-map/place-map.component';

let $ = require('jquery');

let tpl = require('./slider-mobile-place.template.html');
let style = require('./slider-mobile-place.css');

@Component({
  selector: 'slider-place',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, RouterLink]
})

export class SliderMobilePlaceComponent implements OnInit, OnDestroy {
  public allPlaces:any = [];
  public images:any = [];
  public position:any;
  public thing:any;
  public image:any;

  protected openReadMore:boolean;
  @Input('activeThing')
  protected activeThing:any;
  protected familyInfo:any;

  @Input('places')
  private places:Observable<any>;

  @Output('currentPlace')
  private currentPlace:EventEmitter<any> = new EventEmitter<any>();
  @Output('isShowAboutData')
  private isShowAboutData:EventEmitter<any> = new EventEmitter<any>();
  private routeParams:RouteParams;
  private location:Location;
  private arrowDisabled:boolean;
  private chosenPlace:any;
  private slideWidth:number = window.innerWidth;
  private sliderContainer:any;
  private element:ElementRef;
  private streetPlacesSubscribe:any;
  private touchSubscribe:any;
  private zone:NgZone;
  private math:any;
  private resizeSubscribe:any;
  private hoverPlace:ReplaySubject<any> = new ReplaySubject(0);

  public constructor(@Inject(RouteParams) routeParams:RouteParams,
                     @Inject(ElementRef) elementRef:ElementRef,
                     @Inject(NgZone) zone:any,
                     @Inject('Math') math:any,
                     @Inject(Location) location:Location) {
    this.routeParams = routeParams;
    this.element = elementRef;
    this.location = location;
    this.zone = zone;
    this.math = math;
  }

  public ngOnInit():void {
    this.streetPlacesSubscribe = this.places.subscribe((places:any):any => {
      this.thing = this.routeParams.get('thing');
      this.image = this.routeParams.get('image');
      this.allPlaces = places;
      this.sliderContainer = $('.slider-mobile-content .slider-mobile');
      this.init();
    });

    let sliderContainer = this.element.nativeElement.querySelector('#slider-mobile-container');

    this.swipe(sliderContainer);

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.resizeSlider();
      });
  }

  public ngOnDestroy():void {
    this.streetPlacesSubscribe.unsubscribe();
    this.touchSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();
  }

  protected init(position?:any):void {
    this.position = this.allPlaces.map((place:any):any=> {
      return place.image;
    }).indexOf(this.image);
    if (position || position === 0) {
      this.position = position;
    }

    if (this.position === -1) {
      this.position = 0;
    }

    this.images.length = 0;

    this.images = selectImagesForSlider(this.allPlaces, this.position);

    let startImage = this.images[1];
    this.chosenPlace = startImage;

    let img = new Image();

    img.onload = () => {
      this.zone.run(() => {
        this.resizeSlider();
        this.currentPlace.emit([this.chosenPlace]);
        this.hoverPlace.next(this.chosenPlace);
      });
    };

    img.src = startImage.background;
  }

  protected showInfo():void {
    this.isShowAboutData.emit({isDevice: true});
  }

  protected resizeSlider():void {
    this.slideWidth = window.innerWidth;
    let sliderHeight = $('.slider-mobile-slide:nth-child(2) img').height();
    this.sliderContainer.css({height: sliderHeight});
  }

  protected slidePrev():void {
    if (this.arrowDisabled || this.position === 0) {
      return;
    }

    this.arrowDisabled = true;

    if (this.position === 0) {
      this.position = this.allPlaces.length - 1;
    } else {
      this.position--;
    }

    let prevSlide = prevSliderActionAfterAnimation.apply(this, [this.allPlaces, this.images, this.position, this.cb]);

    let shiftPrev = 0;

    let newPrevImage = new Image();

    newPrevImage.onload = () => {
      this.zone.run(() => {
        let sliderHeight = $('.slider-mobile-slide:nth-child(1) img').height();
        this.sliderContainer.css({height: sliderHeight});

        animationSlider(shiftPrev, prevSlide);
      });
    };
    newPrevImage.src = this.images[0].background;
    this.openReadMore = false;
  }

  protected slideNext():void {
    if (this.arrowDisabled || this.allPlaces.length - 1 === this.position) {
      return;
    }

    this.arrowDisabled = true;

    if (this.allPlaces.length - 1 === this.position) {
      this.position = 0;
    } else {
      this.position++;
    }

    let nextSlide = nextSlideActionAfterAnimation.apply(this, [this.allPlaces, this.images, this.position, this.cb]);
    let shiftNext = this.slideWidth * 2;
    let newNextImage = new Image();

    newNextImage.onload = () => {
      this.zone.run(() => {
        let sliderHeight = $('.slider-mobile-slide:nth-child(3) img').height();
        this.sliderContainer.css({height: sliderHeight});

        animationSlider(shiftNext, nextSlide);
      });
    };

    newNextImage.src = this.images[2].background;
    this.openReadMore = false;
  }

  protected cb(err:any, data:any):void {
    if (err) {
      console.log(err);
      return;
    }

    $('.slider-mobile-wrapper .slider-mobile')
      .removeClass('active')
      .css({
        '-webkit-transform': '',
        '-moz-transform': '',
        '-ms-transform': '',
        '-o-transform': '',
        transform: ''
      });

    this.chosenPlace = this.allPlaces[this.position];
    this.arrowDisabled = data.arrowDisabled;
    this.images = data.images;
    this.hoverPlace.next(this.chosenPlace);
    this.currentPlace.emit([this.chosenPlace]);
  };

  public swipe(sliderContainer:HTMLElement):void {
    if (!sliderContainer) {
      return;
    }

    let touchStart = fromEvent(sliderContainer, 'touchstart');
    let touchEnd = fromEvent(sliderContainer, 'touchend');

    this.touchSubscribe = zip(touchStart, touchEnd, (touchStartRes:any, touchEndRes:any) => {
      let startX = touchStartRes.touches[0].clientX;
      let endX = touchEndRes.changedTouches[0].clientX;

      return {startX, endX};
    })
      .subscribe((results:any) => {
        let startX = results.startX;
        let endX = results.endX;

        let difference = startX > endX ? startX - endX : endX - startX;

        if (20 > difference) {
          return;
        }

        if (startX > endX) {
          this.slideNext();
        } else {
          this.slidePrev();
        }
      });
  }
}
/* tslint:disable */
function prevSliderActionAfterAnimation(places:any, images:any, position:any, cb:any):any {
  return () => {
    let prevPlacePosition = position - 1;

    if (places[prevPlacePosition]) {
      images.unshift(places[prevPlacePosition]);
    } else {
      images.unshift(places[places.length - 1]);
    }

    images.length = images.length - 1;

    let res = {
      arrowDisabled: false,
      images: images
    };

    cb.apply(this, [void 0, res]);
  };
}

function nextSlideActionAfterAnimation(places:any, images:any, position:any, cb:any):any {
  return () => {
    let nextPlacePosition = position + 1;

    if (places[nextPlacePosition]) {
      images.push(places[nextPlacePosition]);
    } else {
      images.push(places[0]);
    }

    images.splice(0, 1);

    let res = {
      arrowDisabled: false,
      images: images
    };

    cb.apply(this, [void 0, res]);
  };
}
/* tslint:enable */
function animationSlider(shiftLeft:any, endAnimation:any):any {
  $('.slider-mobile-wrapper .slider-mobile')
    .addClass('active')
    .css({
      '-webkit-transform': 'translate3d(-' + shiftLeft + 'px, 0, 0)',
      '-moz-transform': 'translate3d(-' + shiftLeft + 'px, 0, 0)',
      '-ms-transform': 'translate3d(-' + shiftLeft + 'px, 0, 0)',
      '-o-transform': 'translate3d(-' + shiftLeft + 'px, 0, 0)',
      transform: 'translate3d(-' + shiftLeft + 'px, 0, 0)'
    });

  setTimeout(endAnimation, 600);
}

function selectImagesForSlider(places:any, position:any):any[] {
  let arr = [];
  let index = 1;

  if (places[position - index]) {
    arr.push(places[position - index]);
  } else {
    arr.push(places[places.length - 1]);
  }

  if (places[position]) {
    arr.push(places[position]);
  }

  if (places[position + index]) {
    arr.push(places[position + index]);
  } else {
    arr.push(places[0]);
  }

  return arr;
}
