import { Component, OnInit, OnDestroy, Inject, EventEmitter, Output, Input, NgZone } from '@angular/core';
import { RouterLink, RouteParams } from '@angular/router-deprecated';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { PlaceMapComponent } from '../../common/place-map/place-map.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';

let $ = require('jquery');

let tpl = require('./slider-place.template.html');
let style = require('./slider-place.css');

let sliderWidth = window.innerWidth - 150 - (window.innerWidth - document.body.offsetWidth);
let startPosition = sliderWidth;
let proportion = 2.24;

@Component({
  selector: 'slider-place',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, RouterLink]
})

export class SliderPlaceComponent implements OnInit, OnDestroy {
  public allPlaces:any = [];
  public images:any = [];
  public position:any;
  public thing:any;
  public image:any;
  public place:any;
  public fancyBoxImage:any;

  protected openReadMore:boolean;
  protected familyInfo:any;

  @Input('activeThing')
  protected activeThing:any;

  @Input('controllSlider')
  private controllSlider:Observable<any>;
  @Input('places')
  private places:Observable<any>;
  @Output('currentPlace')
  private currentPlace:EventEmitter<any> = new EventEmitter<any>();
  @Output('isShowAboutData')
  private isShowAboutData:EventEmitter<any> = new EventEmitter<any>();
  private routeParams:RouteParams;
  private location:Location;
  private popIsOpen:boolean;
  private arrowDisabled:boolean;
  private chosenPlace:any;
  private sliderHeight:any = {height: 0};
  private controllSliderSubscribe:any;
  private streetPlacesSubscribe:any;
  private resizeSubscibe:any;
  private keyUpSubscribe:any;
  private zone:NgZone;
  private math:any;
  private hoverPlace:ReplaySubject<any> = new ReplaySubject(0);

  public constructor(@Inject(RouteParams) routeParams:RouteParams,
                     @Inject(Location) location:Location,
                     @Inject(NgZone) zone:NgZone,
                     @Inject('Math') math:any) {
    this.routeParams = routeParams;
    this.location = location;
    this.zone = zone;
    this.math = math;
  }

  public ngOnInit():void {
    this.streetPlacesSubscribe = this.places
      .subscribe((places:any) => {
        this.thing = this.routeParams.get('thing');
        this.image = this.routeParams.get('image');
        this.place = this.routeParams.get('place');
        this.allPlaces = places;
        this.init();
      });

    this.keyUpSubscribe = fromEvent(document, 'keyup')
      .subscribe((e:KeyboardEvent) => {
        if (this.popIsOpen) {
          return;
        }

        if (e.keyCode === 37) {
          this.slidePrev();
        }

        if (e.keyCode === 39) {
          this.slideNext();
        }
      });

    this.controllSliderSubscribe = this.controllSlider
      .subscribe((i:number) => {
        this.init(i);
      });

    this.resizeSubscibe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.resizeSlider();
        });
      });
  }

  public ngOnDestroy():void {
    this.controllSliderSubscribe.unsubscribe();
    this.streetPlacesSubscribe.unsubscribe();
    this.resizeSubscibe.unsubscribe();
    this.keyUpSubscribe.unsubscribe();
  }

  protected init(position?:any):void {
    this.position = this.allPlaces.map((place:any) => {
      return place._id;
    }).indexOf(this.place);

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
        this.hoverPlace.next(this.allPlaces[this.position]);
      });
    };

    img.src = startImage.background;
  }

  protected showInfo(event:any, fixed?:boolean):void {
    this.isShowAboutData.emit({left: event.pageX, top: event.pageY, fixed: fixed});
  }

  protected showInfoUnhover():void {
    this.isShowAboutData.emit({});
  }

  protected resizeSlider(event?:any):void {
    let windowInnerWidth = event ? event.currentTarget.innerWidth : window.innerWidth;
    let windowInnerHeight = event ? event.currentTarget.innerHeight : window.innerHeight;

    sliderWidth = windowInnerWidth - 150 - (windowInnerWidth - document.body.offsetWidth);
    startPosition = sliderWidth;

    $('.slider-container .slider-content').css({
      '-webkit-transform': '',
      '-moz-transform': '',
      '-ms-transform': '',
      '-o-transform': '',
      transform: ''
    });

    let height = sliderWidth / proportion;

    if (sliderWidth / proportion > windowInnerHeight - 225) {
      height = windowInnerHeight - 225;
    }

    height = height < 400 ? 400 : height;

    this.sliderHeight.height = height + 'px';

    setImageWidth(height);
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
        setDescriptionsWidth(1);
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
    let shiftNext = sliderWidth * 2;
    let newNextImage = new Image();

    newNextImage.onload = () => {
      this.zone.run(() => {
        setDescriptionsWidth(3);
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

    $('.slider-container .slider-content')
      .removeClass('active')
      .css({
        '-webkit-transform': 'translateX(-' + startPosition + 'px)',
        '-moz-transform': 'translateX(-' + startPosition + 'px)',
        '-ms-transform': 'translateX(-' + startPosition + 'px)',
        '-o-transform': 'translateX(-' + startPosition + 'px)',
        transform: 'translateX(-' + startPosition + 'px)'
      });

    this.chosenPlace = this.allPlaces[this.position];
    this.arrowDisabled = data.arrowDisabled;
    this.images = data.images;
    this.hoverPlace.next(this.chosenPlace);
    this.currentPlace.emit([this.chosenPlace]);
  };

  protected openPopUp(image:any):void {
    this.popIsOpen = true;
    let imgUrl = image.background.replace('desktops', 'original');
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = 'url("' + imgUrl + '")';
      });
    };

    newImage.src = imgUrl;
  };

  protected fancyBoxClose():void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }
}
/* tslint:disable */
function prevSliderActionAfterAnimation(places:any, images:any, position:number, cb:any):any {
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

function nextSlideActionAfterAnimation(places:any, images:any, position:number, cb:any):any {
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

function animationSlider(shiftLeft:number, endAnimation:any):void {
  $('.slider-container .slider-content')
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

function selectImagesForSlider(places:any, position:number):any {
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

function setImageWidth(sliderHeight:number):void {
  let sliderSidebarImages = $('.slide .slide-content .slide-sidebar img');
  let sliderImages = $('.slide .slide-content .image .slide-img');

  sliderSidebarImages.each(function ():void {
    $(this).width(sliderHeight / 2 - 7.5);
  });

  sliderImages.each(function ():void {
    $(this).width(this.naturalWidth / (this.naturalHeight / sliderHeight));
  });

  setDescriptionsWidth(2);
}
/* tslint:enable */
function setDescriptionsWidth(slideNumber:number):void {
  let slide = $('.slider-content .slide:nth-child(' + slideNumber + ')');
  let slideWidth = slide.find('.slide-wrapper').width();

  slide.find('.slide-description').width(slideWidth);
}
