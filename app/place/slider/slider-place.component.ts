import {Component, OnInit, OnDestroy, Inject, EventEmitter, Output, Input, NgZone} from 'angular2/core';
import {RouterLink, RouteParams, Location} from 'angular2/router';
import {Observable} from 'rxjs/Observable';
import {NgStyle} from 'angular2/common';

import {PlaceMapComponent} from '../../common/place-map/place-map.component';
import {ReplaySubject} from 'rxjs/Subject/ReplaySubject';

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
  directives: [PlaceMapComponent, RouterLink, NgStyle]
})

export class SliderPlaceComponent implements OnInit, OnDestroy {
  @Input('controllSlider')
  private controllSlider:Observable<any>;
  @Input('places')
  private streetPlaces:Observable<any>;
  @Input('activeThing')
  private activeThing:any;

  @Output('currentPlace')
  private currentPlace:EventEmitter<any> = new EventEmitter();

  public allPlaces:any = [];
  public images:any = [];
  public position:any;
  public thing:any;
  public image:any;
  public place:any;
  public fancyBoxImage:any;
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
  private hoverPlace:ReplaySubject<any> = new ReplaySubject(0);

  constructor(@Inject(RouteParams) routeParams,
              @Inject(Location) location,
              @Inject(NgZone) zone) {
    this.routeParams = routeParams;
    this.location = location;
    this.zone = zone;
  }

  ngOnInit():void {
    this.streetPlacesSubscribe = this.streetPlaces
      .subscribe((places) => {
        this.thing = this.routeParams.get('thing');
        this.image = this.routeParams.get('image');
        this.place = this.routeParams.get('place');
        this.allPlaces = places;
        this.init();
      });

    this.keyUpSubscribe = Observable
      .fromEvent(document, 'keyup')
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
      .subscribe((i) => {
        this.init(i);
      });


    this.resizeSubscibe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(300).subscribe(() => {
        this.resizeSlider();
      });
  }


  ngOnDestroy() {
    this.controllSliderSubscribe.unsubscribe();
    this.streetPlacesSubscribe.unsubscribe();
    this.resizeSubscibe.unsubscribe();
    this.keyUpSubscribe.unsubscribe();
  }

  protected init(position?:any) {
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

  protected resizeSlider(event?:any) {
    let windowInnerWidth = event ? event.currentTarget.innerWidth : window.innerWidth;
    let windowInnerHeight = event ? event.currentTarget.innerHeight : window.innerHeight;

    sliderWidth = windowInnerWidth - 150;
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

  protected slidePrev() {
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
      setDescriptionsWidth(1);
      animationSlider(shiftPrev, prevSlide);
    };
    newPrevImage.src = this.images[0].background;
  }

  protected slideNext() {
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
  }

  protected cb(err, data) {
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

  protected openPopUp(image) {
    this.popIsOpen = true;
    this.fancyBoxImage = 'url("' + image.background.replace('desktops', 'original') + '")';
  };

  protected fancyBoxClose() {
    this.popIsOpen = false;
    this.fancyBoxImage = null;
  }
}

function prevSliderActionAfterAnimation(places, images, position, cb) {
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

    cb.apply(this, [null, res]);
  };
}

function nextSlideActionAfterAnimation(places, images, position, cb) {
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

    cb.apply(this, [null, res]);
  };
}

function animationSlider(shiftLeft, endAnimation) {
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

function selectImagesForSlider(places, position) {
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

function setImageWidth(sliderHeight) {
  let sliderSidebarImages = $('.slide .slide-content .slide-sidebar img');
  let sliderImages = $('.slide .slide-content .image .slide-img');

  sliderSidebarImages.each(function () {
    $(this).width(sliderHeight / 2 - 7.5);
  });

  sliderImages.each(function () {
    $(this).width(this.naturalWidth / (this.naturalHeight / sliderHeight));
  });

  setDescriptionsWidth(2);
}

function setDescriptionsWidth(slideNumber) {
  let slide = $('.slider-content .slide:nth-child(' + slideNumber + ')');
  let slideWidth = slide.find('.slide-wrapper').width();

  slide.find('.slide-description').width(slideWidth);
}
