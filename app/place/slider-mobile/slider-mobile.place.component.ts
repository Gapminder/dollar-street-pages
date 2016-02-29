import {Component, OnInit, Inject} from 'angular2/core';
import {
  RouterLink,
  RouteParams,
  Location
} from 'angular2/router';

import {SliderMobilePlaceService} from './slider-mobile.place.service';

let $ = require('jquery');
let async = require('async');

let tpl = require('./slider-mobile.place.component.html');
let style = require('./slider-mobile.place.component.css');

let windowInnerWidth = window.innerWidth;
let startPosition = windowInnerWidth;

@Component({
  selector: 'slider-place',
  template: tpl,
  styles: [style],
  providers: [SliderMobilePlaceService],
  directives: [RouterLink]
})

export class SliderMobilePlaceComponent {
  public sliderPlaceService:SliderMobilePlaceService;
  public allPlaces:any = [];
  public images:any = [];
  public position:any;
  public thing:any;
  public image:any;
  public amazonUrl:any = 'http://static.dollarstreet.org.s3.amazonaws.com/';
  public fancyBoxImage:any;
  private routeParams:RouteParams;
  private location:any;

  constructor(@Inject(SliderMobilePlaceService) sliderPlaceService,
              @Inject(RouteParams) routeParams,
              @Inject(Location) location) {
    this.sliderPlaceService = sliderPlaceService;
    this.routeParams = routeParams;
    this.location = location;
  }

  ngOnInit():void {

    this.getThings();

    document.addEventListener('keyup', (e) => {
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
  }

  getThings() {
    this.thing = this.routeParams.get('thing');
    this.image = this.routeParams.get('image');

    let query = `image=${this.image}&thing=${this.thing}`;

    this.sliderPlaceService.getThingsByRegion(query)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.updateArr(this.allPlaces, res.data.places);

        this.thing = res.data.thing;
        this.image = res.data.image;

        let query = `image=${this.image}&thing=${this.thing._id}`;

        this.location.replaceState(`/place`, `${query}`);

        this.init();
      });
  }

  init(position:any) {

    this.position = this.allPlaces.map(function (place) {
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

    var startImage = this.images[1];
    this.chosenPlace = startImage;

    var img = new Image();

    img.onload = () => {
      let sliderHeight = $('.slider-mobile-slide:nth-child(2) img').height();
      $('.slider-mobile-content .slider-mobile').css({height: sliderHeight});
    };

    img.src = startImage.url;

    windowInnerWidth = window.innerWidth;
    startPosition = windowInnerWidth;

    $('.slider-mobile').css({
      width: windowInnerWidth * 3 + 'px',
      '-webkit-transform': 'translate3d(-' + startPosition + 'px, 0, 0)',
      '-moz-transform': 'translate3d(-' + startPosition + 'px, 0, 0)',
      '-ms-transform': 'translate3d(-' + startPosition + 'px, 0, 0)',
      '-o-transform': 'translate3d(-' + startPosition + 'px, 0, 0)',
      transform: 'translate3d(-' + startPosition + 'px, 0, 0)'
    });

    var sliderHeight = $('.slider-mobile-slide:nth-child(2) img').height();
    $('.slider-mobile-content .slider-mobile').css({height: sliderHeight});

  }

  updateArr(context:any, update:any, change:any) {
    var cloneArr = update.slice(0);

    if (change) {
      cloneArr = change(cloneArr);
    }

    Array.prototype.unshift.apply(cloneArr, [0, 1]);
    Array.prototype.splice.apply(context, cloneArr);
  }

  slidePrev() {
    if (this.arrowDisabled || this.position === 0) {
      return;
    }

    this.arrowDisabled = true;

    if (this.position === 0) {
      this.position = this.allPlaces.length - 1;
    } else {
      this.position--;
    }

    let prevSlide = prevSliderActionAfterAnimation(this.allPlaces, this.images, this.position, this.cb);

    let sliderHeight = $('.slider-mobile-slide:nth-child(1) img').height();

    if (sliderHeight) {
      $('.slider-mobile-content .slider-mobile').css({height: sliderHeight});
    }

    let shiftPrev = 0;
    animationSlider(shiftPrev, prevSlide);

  }

  slideNext() {
    if (this.arrowDisabled || this.allPlaces.length - 1 === this.position) {
      return;
    }

    this.arrowDisabled = true;

    if (this.allPlaces.length - 1 === this.position) {
      this.position = 0;
    } else {
      this.position++;
    }

    var nextSlide = nextSlideActionAfterAnimation(this.allPlaces, this.images, this.position, this.cb);

    let sliderHeight = $('.slider-mobile-slide:nth-child(3) img').height();

    if (sliderHeight) {
      $('.slider-mobile-content .slider-mobile').css({height: sliderHeight});
    }

    let shiftNext = windowInnerWidth * 2;

    animationSlider(shiftNext, nextSlide);
  }

  cb = (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    $('.slider-mobile-container .slider-mobile-content .slider-mobile')
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
    this.isShowInfoFamily = false;
  };

  goToThing() {
    this.getThings();
  }

  showInfoFamily (placeId) {
    if (!placeId) {
      return;
    }

    let query = `placeId=${placeId}`;

    this.sliderPlaceService.getPlaceSliderFamily(query)
      .subscribe((res:any)=> {

        if (res.err) {
          return res.err;
        }

      this.family = res.data.family;
      this.house = res.data.house;
      this.isShowInfoFamily = true;
    })
  }
}

function prevSliderActionAfterAnimation(places, images, position, cb) {
  return function () {
    var prevPlacePosition = position - 1;

    if (places[prevPlacePosition]) {
      images.unshift(places[prevPlacePosition]);
    } else {
      images.unshift(places[places.length]);
    }

    images.length = images.length - 1;

    var res = {
      arrowDisabled: false,
      images: images
    };

    cb(null, res);
  };
}

function nextSlideActionAfterAnimation(places, images, position, cb) {
  return function () {
    var nextPlacePosition = position + 1;

    if (places[nextPlacePosition]) {
      images.push(places[nextPlacePosition]);
    } else {
      images.push(places[0]);
    }

    images.splice(0, 1);

    var res = {
      arrowDisabled: false,
      images: images
    };

    cb(null, res);
  };
}

function animationSlider(shiftLeft, endAnimation) {
  $('.slider-mobile-container .slider-mobile-content .slider-mobile')
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

  var arr = [];
  var index = 1;

  if (places[position - index]) {
    arr.push(places[position - index]);
  } else {
    arr.push(places[places.length]);
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
