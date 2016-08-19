import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  Inject,
  OnDestroy,
  OnChanges,
  EventEmitter
} from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Rx';

const _ = require('lodash');

let tpl = require('./street.template.html');
let style = require('./street.css');

@Component({
  selector: 'street',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES]
})

export class StreetComponent implements OnInit, OnDestroy, OnChanges {
  public data: any;
  protected math: any;
  @Input('thing')
  protected thing: string;
  @Input('query')
  private query: string;
  @Input('places')
  private places: Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces: Observable<any>;
  @Input('hoverPlace')
  private hoverPlace: Subject<any>;
  @Output('filterStreet')
  private filterStreet: EventEmitter<any> = new EventEmitter<any>();

  private street: any;
  private streetSettingsService: any;
  private streetData: any;
  private element: HTMLElement;
  private activatedRoute: ActivatedRoute;
  private StreetServiceSubscrib: Subscription;
  private resize: any;
  private drawOnMap: boolean = false;

  private placesSubscribe: Subscription;
  private hoverPlaceSubscribe: Subscription;
  private chosenPlacesSubscribe: Subscription;
  private svg: SVGElement;
  private showSlider: boolean;
  private placesArr: any;

  public constructor(@Inject(ElementRef) element: ElementRef,
                     @Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
                     @Inject('Math') math: any,
                     @Inject('StreetSettingsService') streetSettingsService: any,
                     @Inject('StreetDrawService') streetDrawService: any) {
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
    this.showSlider = this.activatedRoute.snapshot.url[0].path === 'matrix';
  }

  public ngOnInit(): any {
    this.street.setSvg = this.svg = this.element.querySelector('.street-box svg') as SVGElement;
    this.street.set('isInit', true);

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces: any): void => {
        if (!chosenPlaces.length) {
          this.street.set('chosenPlaces', []);
          this.street.clearAndRedraw(chosenPlaces);

          return;
        }

        this.street.set('chosenPlaces', chosenPlaces);
        this.street.clearAndRedraw(chosenPlaces);
      });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe((hoverPlace: any): void => {
        if (this.drawOnMap) {
          this.drawOnMap = !this.drawOnMap;

          return;
        }

        if (!this.street.scale && this.street.isInit) {
          this.street.set('hoverPlace', hoverPlace);

          return;
        }

        if (!hoverPlace) {
          this.street.removeHouses('hover');
          this.street.set('hoverPlace', undefined);
          this.street.clearAndRedraw(this.street.chosenPlaces);

          return;
        }

        this.street.set('hoverPlace', hoverPlace);
        this.street.drawHoverHouse(hoverPlace);
      });

    this.placesSubscribe = this.places && this.places.subscribe((places: any): void => {
        this.placesArr = places;
        if (!this.streetData) {
          return;
        }

        this.setDividers(this.placesArr, this.streetData);
      });

    this.StreetServiceSubscrib = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;

        if (!this.placesArr) {
          return;
        }

        this.setDividers(this.placesArr, this.streetData);
      });

    this.street.filter.subscribe((filter: any): void => {
      let query: any;

      if (this.query) {
        query = this.parseUrl(this.query);
      } else {
        query = {};
      }

      query.lowIncome = filter.lowIncome;
      query.highIncome = filter.highIncome;

      if (filter.lowIncome === this.street.lowIncome && filter.highIncome === this.street.highIncome) {
        return;
      }

      this.filterStreet.emit({url: this.objToQuery(query)});
    });

    this.street.filter.next({lowIncome: this.street.lowIncome, highIncome: this.street.highIncome});

    this.resize = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        if (!this.street.places) {
          return;
        }

        this.setDividers(this.placesArr, this.streetData);
      });
  }

  public ngOnChanges(changes: any): void {
    if (changes.query && changes.query.currentValue) {
      let parseUrl = this.parseUrl(this.query);

      this.street.set('lowIncome', parseUrl.lowIncome);
      this.street.set('highIncome', parseUrl.highIncome);
    }
  }

  public ngOnDestroy(): void {
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

    if (this.StreetServiceSubscrib) {
      this.StreetServiceSubscrib.unsubscribe();
    }
  }

  private setDividers(places: any, drawDividers: any): void {
    this.street
      .clearSvg()
      .init(this.street.lowIncome, this.street.highIncome, this.streetData)
      .set('places', _.sortBy(places, 'income'))
      .set('fullIncomeArr', _
        .chain(this.street.places)
        .sortBy('income')
        .map((place: any) => {
          if (!place) {
            return void 0;
          }

          return this.street.scale(place.income);
        })
        .compact()
        .value())
      .drawScale(places, this.showSlider, drawDividers);

    if (this.street.chosenPlaces && this.street.chosenPlaces.length) {
      this.street.clearAndRedraw(this.street.chosenPlaces);
    }
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private parseUrl(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }
}
