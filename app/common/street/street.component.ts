import {Component, OnInit, Input, ElementRef, Inject, OnDestroy} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

const _ = require('lodash');
let device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./street.template.html');
let style = require('./street.css');

@Component({
  selector: 'street',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class StreetComponent implements OnInit, OnDestroy {
  @Input('thing')
  private thing:string;
  @Input('hoverHeader')
  private hoverHeader:Observable<any>;
  @Input('places')
  private places:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Input('hoverPlace')
  private hoverPlace:Subject<any>;
  @Input('controllSlider')
  private controllSlider:Subject<any>;

  private street:any;
  private StreetDrawService:any;
  private element:HTMLElement;
  private thumbPlaces:any[];
  private thumbLeft:number;
  private arrowLeft:number;
  private isThumbView:boolean;
  private router:Router;

  private resize:any;
  private drawOnMap:boolean = false;

  private placesSubscribe:any;
  private hoverPlaceSubscribe:any;
  private chosenPlacesSubscribe:any;
  private hoverHeaderSubscribe:any;

  constructor(@Inject(ElementRef) element,
              @Inject(Router)  router,
              @Inject('StreetDrawService')  streetDrawService) {
    this.element = element.nativeElement;
    this.router = router;
    this.street = streetDrawService;
  }

  ngOnInit():any {
    let svg = this.element.querySelector('.street-box svg') as HTMLElement;
    this.street.setSvg = svg;

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces) => {
        this.street.set('chosenPlaces', chosenPlaces);

        if (this.controllSlider) {
          this.street.clearAndRedraw(chosenPlaces, true);

          return;
        }

        this.street.clearAndRedraw(chosenPlaces);
      });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe((hoverPlace) => {
        if (this.drawOnMap) {
          this.drawOnMap = !this.drawOnMap;
          return;
        }
        if (!hoverPlace) {
          this.street.removeHouses('hover');

          return;
        }

        this.street.set('hoverPlace', hoverPlace);
        this.street.clearAndRedraw(this.street.chosenPlaces);
        this.street.drawHoverHouse(hoverPlace);
      });

    this.hoverHeaderSubscribe = this.hoverHeader && this.hoverHeader.subscribe(() => {
        this.thumbUnhover();
      });

    this.placesSubscribe = this.places && this.places.subscribe((places) => {
        this.street
          .clearSvg()
          .init()
          .drawScale(places)
          .set('places', _.sortBy(places, 'income'))
          .set('fullIncomeArr', _
            .chain(places)
            .sortBy('income')
            .map((place:any) => {
              return this.street.scale(place.income);
            })
            .value()
          );
      });

    this.resize = Observable
      .fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.street
          .clearSvg()
          .init()
          .drawScale(this.street.places)
          .set('places', _.sortBy(this.street.places, 'income'))
          .set('fullIncomeArr', _
            .chain(this.street.places)
            .sortBy('income')
            .map((place:any) => {
              return this.street.scale(place.income);
            }).value()
          )
          .set('chosenPlaces', this.street.chosenPlaces)
          .clearAndRedraw(this.street.chosenPlaces);
      });
  }

  onStreet(e) {
    if (!isDesktop) {
      return;
    }

    this.street.onSvgHover(e.clientX, (options) => {
      let {places, left} = options;
      this.isThumbView = true;
      this.thumbPlaces = places;
      let indent = 3 * 176 / 2;

      if (places.length === 2) {
        indent = 2 * 176 / 2;
      }

      if (places.length === 1) {
        indent = 176 / 2;
        if (this.hoverPlace) {
          this.hoverPlace.next(places[0]);
        }
      }
      if (places.length > 1) {
        this.drawOnMap = true;
        if (this.hoverPlace) {
          this.hoverPlace.next(null);
        }
      }

      this.thumbLeft = left - indent + 15;

      if (this.thumbLeft <= 15) {
        this.thumbLeft = 15;
      }

      if (this.thumbLeft + 2 * indent >= window.innerWidth - 15) {
        this.thumbLeft = window.innerWidth - 30 - 2 * indent;
      }

      this.arrowLeft = left - this.thumbLeft + 9;
    });
  }

  ngOnDestroy() {
    if (this.resize) {
      this.resize.unsubscribe();
    }

    if (this.placesSubscribe) {
      this.placesSubscribe.unsubscribe();
    }

    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }

    if (this.chosenPlacesSubscribe) {
      this.chosenPlacesSubscribe.unsubscribe();
    }

    if (this.hoverHeaderSubscribe) {
      this.hoverHeaderSubscribe.unsubscribe();
    }
  }

  public thumbHover(place) {
    if (this.hoverPlace) {
      this.hoverPlace.next(place);
    }
    this.street
      .removeHouses('chosen')
      .removeHouses('hover');

    this.street.set('hoverPlace', place);
    this.street.drawHoverHouse(place);
  };

  public thumbUnhover() {
    if (this.hoverPlace) {
      this.hoverPlace.next(null);
    }
    this.street.hoverPlace = null;
    if (this.controllSlider) {
      this.street.clearAndRedraw(this.street.chosenPlaces, true);
    } else {
      this.street.clearAndRedraw(this.street.chosenPlaces);
    }

    this.isThumbView = false;
  }

  protected toUrl(image) {
    return `url("${image.replace('desktops', '150x150')}")`;
  }

  protected clickOnThumb(thing, place) {
    this.isThumbView = false;

    if (this.controllSlider) {
      var j;

      _.forEach(this.street.places, function (p, t) {
        if (p._id !== place._id) {
          return;
        }

        j = t;
      });

      this.controllSlider.next(j);

      return;
    }

    this.router.navigate(['Place', {thing: thing, place: place._id, image: place.image}]);
  }
}
