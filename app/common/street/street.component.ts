import {Component, OnInit, Input, ElementRef, Inject} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {RouterLink, Router} from 'angular2/router';
import {StreetDrawService} from "./street.service";
import {Subject} from "rxjs/Subject";

let device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./street.component.html');
let style = require('./street.component.css');

@Component({
  selector: 'street',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class StreetComponent implements OnInit {
  @Input('thing')
  private thing:string;
  @Input('hoverHeader')
  private hoverHeader:Observable<any>;
  @Input('places')
  private places:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Input('hoverPlace')
  private hoverPlace:Observable<any>;
  @Input('controllSlider')
  private controllSlider:Subject<any>;

  private street:any;
  private element:HTMLElement;
  private thumbPlaces:any[];
  private thumbLeft:number;
  private arrowLeft:number;
  private isThumbView:boolean;
  private router:Router;

  constructor(@Inject(ElementRef) element,
              @Inject(Router)  router) {
    this.element = element.nativeElement;
    this.router = router;
  }

  ngOnInit():any {
    let svg = this.element.querySelector('.street-box svg') as HTMLElement;
    this.street = new StreetDrawService(svg);
    this.street.init();

    this.places && this.places.subscribe((places)=> {
      this.street
        .clearSvg()
        .drawScale(places)
        .set('places', _.sortBy(places, 'income'))
        .set('fullIncomeArr', _
          .chain(places)
          .sortBy('income')
          .map((place:any)=> {
            return this.street.scale(place.income);
          })
          .value()
        );
    });

    Observable
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

    this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces)=> {
      this.street.set('chosenPlaces', chosenPlaces)
      if (this.controllSlider) {
        this.street.clearAndRedraw(chosenPlaces, true);
        return;
      }
      this.street.clearAndRedraw(chosenPlaces);
    });

    this.hoverPlace && this.hoverPlace.subscribe((hoverPlace)=> {
      this.street.set('hoverPlace', hoverPlace);
      this.street.clearAndRedraw(this.street.chosenPlaces);
      if (!hoverPlace) {
        return;
      }
      this.street.drawHoverHouse(hoverPlace);
    });

    this.hoverHeader && this.hoverHeader.subscribe(()=> {
      this.thumbUnhover()
    })
  }

  onStreet(e) {
    if (!isDesktop) {
      return;
    }

    this.street.onSvgHover(e.x, (options)=> {
      let {places, left}=options;
      this.isThumbView = true;

      this.thumbPlaces = places;

      let indent = 3 * 176 / 2;

      if (places.length === 2) {
        indent = 2 * 176 / 2;
      }

      if (places.length === 1) {
        indent = 176 / 2;
      }

      this.thumbLeft = left - indent + 15;

      if (this.thumbLeft <= 15) {
        this.thumbLeft = 15
      }
      if (this.thumbLeft + 2 * indent >= window.innerWidth - 15) {
        this.thumbLeft = window.innerWidth - 30 - 2 * indent;
      }

      this.arrowLeft = left - this.thumbLeft + 9;
    })
  }

  public thumbHover(place) {
    this.street
      .removeHouses('chosen')
      .removeHouses('hover')
    this.street.set('hoverPlace', place)
    this.street.drawHoverHouse(place)
  };

  public thumbUnhover() {
    this.street.hoverPlace = null;
    if (this.controllSlider) {
      this.street.clearAndRedraw(this.street.chosenPlaces, true);
    } else {
      this.street.clearAndRedraw(this.street.chosenPlaces);
    }
    this.isThumbView = false;
  }

  private toUrl(image) {
    return `url("${image.replace('devices', '150x150')}")`;
  }

  private clickOnThumb(thing, place) {
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

    this.router.navigate(['Place', {thing: thing, place: place._id, image: place.image}])
  }
}
