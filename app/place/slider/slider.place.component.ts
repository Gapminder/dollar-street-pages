import { Component, OnInit , Inject,EventEmitter,Output,Input } from 'angular2/core';
import {
  RouterLink,
  RouteParams,
  Location
} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {SliderPlaceService} from './slider.place.service';

let $ = require('jquery');
let async = require('async');

let tpl = require('./slider.place.component.html');
let style = require('./slider.place.component.css');


let sliderWidth = window.innerWidth - 150 - (window.innerWidth - document.body.offsetWidth);
let startPosition = sliderWidth;
let slideContent = null;
let proportion = 2.24;
let slideHeight = sliderWidth / proportion;

@Component({
  selector: 'slider-place',
  template: tpl,
  styles: [style],
  providers: [SliderPlaceService],
  directives:[RouterLink]
})

export class SliderPlaceComponent {
  public sliderPlaceService:SliderPlaceService;
  public allPlaces:any = [];
  public images:any = [];
  public position:any;
  public thing:any;
  public image:any;
  public amazonUrl:any = 'http://static.dollarstreet.org.s3.amazonaws.com/';
  public fancyBoxImage:any;
  private routeParams:RouteParams;
  private location:Location;
  private popIsOpen:boolean;
  private arrowDisabled:boolean;
  private chosenPlace:any;

  @Input('controllSlider')
  private controllSlider:Observable<any>;

  @Output('currentPlace')
  private currentPlace:EventEmitter<any> = new EventEmitter();

  constructor(@Inject(SliderPlaceService) sliderPlaceService,
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

    this.controllSlider.subscribe((i)=>{
      this.init(i)
    })

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
        this.init();
      });
  }

  init(position?:any) {

    this.position = this.allPlaces.map(function (place:any) {
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
      this.resizeSlider();
      this.currentPlace.emit([this.chosenPlace]);
    };

    img.src = startImage.background;
  }

  resizeSlider(event?:any) {

    var windowInnerWidth = event ? event.currentTarget.innerWidth : window.innerWidth;
    var windowInnerHeight = event ? event.currentTarget.innerHeight : window.innerHeight;

    sliderWidth = windowInnerWidth - 150 - (window.innerWidth - document.body.offsetWidth);
    startPosition = sliderWidth;

    $('.slider-container .slider-content').css({
      '-webkit-transform': '',
      '-moz-transform': '',
      '-ms-transform': '',
      '-o-transform': '',
      transform: ''
    });

    slideContent = $('.slide .slide-content, .arrow-container');

    if (sliderWidth / proportion > windowInnerHeight - 225) {
      slideHeight = windowInnerHeight - 225;
      slideContent.css({height: slideHeight});

      setImageWidth();
      return;
    }

    slideHeight = sliderWidth / proportion;
  }

  updateArr (context:any, update?:any, change?:any) {
    var cloneArr = update.slice(0);

    if (change) {
      cloneArr = change(cloneArr);
    }

    Array.prototype.unshift.apply(cloneArr, [0, 1]);
    Array.prototype.splice.apply(context, cloneArr);
  }

  slidePrev () {
    if (this.arrowDisabled || this.position === 0) {
      return;
    }

    this.arrowDisabled = true;

    if (this.position === 0) {
      this.position = this.allPlaces.length - 1;
    } else {
      this.position--;
    }

    var prevSlide = prevSliderActionAfterAnimation(this.allPlaces, this.images, this.position, this.cb);

    var shiftPrev = 0;

    var newPrevImage = new Image();

    newPrevImage.onload = function () {
      setDescriptionsWidth(1);
      animationSlider(shiftPrev, prevSlide);
    };

    newPrevImage.src = this.images[0].background;
  }

  slideNext () {
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

    var shiftNext = sliderWidth * 2;

    var newNextImage = new Image();

    newNextImage.onload = function () {
      setDescriptionsWidth(3);
      animationSlider(shiftNext, nextSlide);
    };

    newNextImage.src = this.images[2].background;
  }

  cb = (err, data) => {
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
    this.currentPlace.emit([this.chosenPlace]);
  };

  openPopUp = (image) => {
    this.popIsOpen = true;
    this.fancyBoxImage = 'url("' + image.background.replace('desktops', 'original') + '")';
  };

  fancyBoxClose = () => {
    this.popIsOpen = false;
    this.fancyBoxImage = null;
  }

  goToThing() {
    this.getThings();
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


function setImageWidth() {
  var sliderSidebarImages = $('.slide .slide-content .slide-sidebar img');
  var sliderImages = $('.slide .slide-content .image .slide-img');

  async.parallel({
    sliderSidebarImages: function (cb) {
      sliderSidebarImages.each(function () {
        $(this).width($(this).height());
      });

      cb(null);
    },
    sliderImages: function (cb) {
      sliderImages.each(function () {
        $(this).width(this.naturalWidth / (this.naturalHeight / this.clientHeight));
      });

      cb(null);
    }
  }, function (err) {
    if (err) {
      return console.log(err);
    }

    setDescriptionsWidth(2);
  });
}

function setDescriptionsWidth(slideNumber) {
  var slide = $('.slider-content .slide:nth-child(' + slideNumber + ')');
  var slideWidth = slide.find('.slide-wrapper').width();

  slide.find('.slide-description').width(slideWidth);
}
