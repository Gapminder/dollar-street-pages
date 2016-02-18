import {Component, OnInit, Input, ElementRef, Inject} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {StreetDrawService} from "./street.service";


let tpl = require('./street.component.html');
let style = require('./street.component.css');

@Component({
  selector: 'street',
  template: tpl,
  styles: [style],
})

export class StreetComponent implements OnInit {
  @Input('hoverHeader')
  private hoverHeader:Observable<any>;
  @Input('places')
  private places:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Input('hoverPlace')
  private hoverPlace:Observable<any>;

  private street:any;

  private element:HTMLElement;

  private thumbPlaces:any[];

  private thumbLeft:number;
  private isThumbView:boolean;

  constructor(@Inject(ElementRef) element) {
    this.element = element.nativeElement;
  }

  ngOnInit():any {
    let svg = this.element.querySelector('.street-box svg') as HTMLElement;
    this.street = new StreetDrawService(svg);
    this.street.init();
    this.places&&this.places.subscribe((places)=> {
      this.street
        .drawScale(places)
        .set('places', _.sortBy(places, 'income'))
        .set('fullIncomeArr', _.chain(places).sortBy('income').map((place:any)=> {
          return this.street.scale(place.income);
        }).value());
    });

    this.chosenPlaces&&this.chosenPlaces.subscribe((chosenPlaces)=> {
      this.street.set('chosenPlaces', chosenPlaces).clearAndRedraw(chosenPlaces);
    });


    this.hoverPlace&&this.hoverPlace.subscribe((hoverPlace)=> {
      this.street.set('hoverPlace', hoverPlace);
      this.street.clearAndRedraw(this.street.chosenPlaces);
      if (!hoverPlace) {
        return;
      }
      this.street.drawHoverCircle(hoverPlace).drawHoverHouse(hoverPlace);
    })
    this.hoverHeader&&this.hoverHeader.subscribe(()=>{
      this.thumbUnhover()
    })
  }

  onStreet(e) {
    this.street.onSvgHover(e.x, (options)=> {
      let {places, left}=options;
      this.isThumbView = true;

      this.thumbPlaces = places;

      let indent = 260;
      if (places.length === 2) {
        indent = 175;
      }
      if (places.length === 1) {
        indent = 87.5;
      }
      this.thumbLeft = left - indent;
    })
  }


  public thumbHover(place) {
    this.street
      .removeHouses('chosen')
      .removeCircles('hover');
    let currentPlaces = _.filter(this.street.places, (currentPlace:any) => {
      return currentPlace.income === place.income;
    });
    this.street.set('hoverPlace', place)
      .drawLineOfHouses(currentPlaces)
      .drawHoverCircle(place);
  };

  public thumbUnhover() {
    this.street.hoverPlace = null;
    this.street.clearAndRedraw(this.street.chosenPlaces);
    this.isThumbView = false;
  }

}
