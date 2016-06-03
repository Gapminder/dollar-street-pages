import {Component, OnInit, Input, Output, ElementRef, Inject, OnDestroy, EventEmitter} from '@angular/core';
import {RouterLink, Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {Subject} from 'rxjs/Subject';

const _ = require('lodash');

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
  protected thing:string;
  @Input('places')
  private places:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Input('hoverPlace')
  private hoverPlace:Subject<any>;
  @Input('controllSlider')
  private controllSlider:Subject<any>;
  @Output('filterStreet')
  private filterStreet:EventEmitter = new EventEmitter();

  private street:any;
  private element:HTMLElement;
  private router:Router;

  private resize:any;
  private drawOnMap:boolean = false;

  private placesSubscribe:any;
  private hoverPlaceSubscribe:any;
  private chosenPlacesSubscribe:any;
  private mouseMoveSubscriber:any;
  private math:any;
  private svg:SVGElement;
  private showSlider:boolean;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(Router) router:Router,
                     @Inject('Math') math:any,
                     @Inject('StreetDrawService') streetDrawService:any) {
    this.element = element.nativeElement;
    this.router = router;
    this.math = math;
    this.street = streetDrawService;
    this.showSlider = this.router.hostComponent.name === 'MatrixComponent';
  }

  public ngOnInit():any {
    this.street.setSvg = this.svg = this.element.querySelector('.street-box svg') as SVGElement;

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces:any):void => {
        if (!chosenPlaces.length) {
          this.street.clearAndRedraw(chosenPlaces);
          return;
        }

        this.street.set('chosenPlaces', chosenPlaces);

        if (this.controllSlider) {
          this.street.clearAndRedraw(chosenPlaces, true);

          return;
        }

        this.street.clearAndRedraw(chosenPlaces);
      });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe((hoverPlace:any):void => {
        if (this.drawOnMap) {
          this.drawOnMap = !this.drawOnMap;

          return;
        }

        if (!hoverPlace) {
          this.street.removeHouses('hover');
          this.street.clearAndRedraw(this.street.chosenPlaces);

          return;
        }

        this.street.set('hoverPlace', hoverPlace);
        this.street.drawHoverHouse(hoverPlace);
      });

    this.placesSubscribe = this.places && this.places.subscribe((places:any):void => {
        let lowIncome = this.street.lowIncome;
        let hightIncome = this.street.hightIncome;

        this.street
          .clearSvg()
          .init()
          .drawScale(places, this.showSlider, lowIncome, hightIncome)
          .set('places', _.sortBy(places, 'income'))
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

        if (this.street.chosenPlaces && this.street.chosenPlaces.length) {
          this.street.clearAndRedraw(this.street.chosenPlaces);
        }
      });

    this.street.filter.subscribe((filter:any):void=> {
      this.filterStreet.emit(filter);
    });

    this.street.filter.next({lowIncome: this.street.lowIncome, hightIncome: this.street.hightIncome});

    this.resize = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.street
          .clearSvg()
          .init()
          .drawScale(this.street.places, this.showSlider)
          .set('places', _.sortBy(this.street.places, 'income'))
          .set('fullIncomeArr', _
            .chain(this.street.places)
            .sortBy('income')
            .map((place:any) => {
              if (!place || !place.length) {
                return;
              }

              return this.street.scale(place.income);
            }).value()
          )
          .set('chosenPlaces', this.street.chosenPlaces);

        if (this.controllSlider) {
          this.street.clearAndRedraw(this.street.chosenPlaces, true);

          return;
        }

        this.street.clearAndRedraw(this.street.chosenPlaces);
      });
  }

  public ngOnDestroy():void {
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

    if (this.mouseMoveSubscriber) {
      this.mouseMoveSubscriber.unsubscribe();
    }
  }
}
