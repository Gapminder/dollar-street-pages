import {Component, OnInit, Input, ElementRef, Inject, OnDestroy} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Subject} from 'rxjs/Subject';

const _ = require('lodash');

let tpl = require('./street-mini.template.html');
let style = require('./street-mini.css');

@Component({
  selector: 'street-mini',
  template: tpl,
  styles: [style]
})

export class StreetMiniComponent implements OnInit, OnDestroy {

  @Input('chosenPlace')
  private chosenPlace:Subject<any>;
  @Input('incomesByCountry')
  private incomesByCountry:Subject<any>;

  private street:any;
  private element:HTMLElement;
  private router:Router;

  private placesSubscribe:any;
  private chosenPlaceSubscribe:any;
  private math:any;
  private svg:SVGElement;
  private showSlider:boolean = false;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(Router) router:Router,
                     @Inject('Math') math:any,
                     @Inject('StreetMiniDrawService') StreetMiniDrawService:any) {
    this.element = element.nativeElement;
    this.router = router;
    this.math = math;
    this.street = StreetMiniDrawService;
  }

  public ngOnInit():any {

    this.street.setSvg = this.svg = this.element.querySelector('.street-mini-box svg') as SVGElement;

    this.chosenPlaceSubscribe = this.chosenPlace && this.chosenPlace.subscribe((chosenPlace:any):void => {
        if (!chosenPlace) {
          console.log('i am in IF !hoverPlace');
          this.street.removeHouses('hover');
          this.street.clearAndRedraw(this.street.chosenPlaces);
          return;
        }

        this.street
          .clearSvg()
          .init()
          .drawScale([chosenPlace], this.showSlider, 0, 15000)
          .set('places', _.sortBy([chosenPlace], 'income'))
          .set('fullIncomeArr', _
            .chain(this.street.places)
            .sortBy('income')
            .map((place:any) => {
              if (!place) {
                return void 0;
              }

              return this.street.scale(place.income);
            })
            .compact()
            .value());

        this.street.set('hoverPlace', chosenPlace);

        this.street.drawHoverHouse(chosenPlace);
        console.log('STREET:::', this.street);
      });
  }

  public ngOnDestroy():void {
    if (this.placesSubscribe) {
      this.placesSubscribe.unsubscribe();
    }

    if (this.chosenPlaceSubscribe) {
      this.chosenPlaceSubscribe.unsubscribe();
    }
  }
}
