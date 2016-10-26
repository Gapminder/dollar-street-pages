import 'rxjs/operator/debounceTime';

import { Component, OnInit, Input, Output, ElementRef, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { sortBy, chain, differenceBy } from 'lodash';

import { MathService, StreetSettingsService } from '../../common';
import { StreetDrawService } from './street.service';

@Component({
  selector: 'street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.css']
})

export class StreetComponent implements OnInit, OnDestroy, OnChanges {
  public data: any;
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
  private regions: any;
  private thingname: any;
  private countries: any;
  private math: MathService;
  private streetSettingsService: StreetSettingsService;
  private streetData: any;
  private element: HTMLElement;
  private activatedRoute: ActivatedRoute;
  private streetServiceSubscribe: Subscription;
  private resize: any;
  private drawOnMap: boolean = false;

  private placesSubscribe: Subscription;
  private hoverPlaceSubscribe: Subscription;
  private chosenPlacesSubscribe: Subscription;
  private streetFilterSubscribe: Subscription;
  private placesArr: any;
  private streetBoxContainer: HTMLElement;
  private streetBoxContainerMargin: number;

  public constructor(element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     math: MathService,
                     streetSettingsService: StreetSettingsService,
                     streetDrawService: StreetDrawService) {
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
  }

  public ngOnInit(): any {
    this.street.setSvg = this.element.querySelector('.street-box svg') as SVGElement;
    this.streetBoxContainer = this.element.querySelector('.street-box') as HTMLElement;
    let streetBoxContainerMarginLeft: string = window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');
    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;
    this.street.set('isInit', true);

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces: any): void => {
        let difference: any[] = differenceBy(chosenPlaces, this.street.chosenPlaces, '_id');

        if (
          this.street.width + this.street.streetOffset + this.streetBoxContainerMargin !== document.body.offsetWidth &&
          this.placesArr &&
          this.streetData
        ) {
          this.setDividers(this.placesArr, this.streetData);

          return;
        }

        if (!difference.length) {
          return;
        }

        this.street.set('chosenPlaces', chosenPlaces.length ? chosenPlaces : []);

        if (!this.street.scale) {
          return;
        }

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

        if (!places.length) {
          this.street
            .clearSvg()
            .init(this.street.lowIncome, this.street.highIncome, this.streetData, this.regions, this.countries, this.thingname)
            .set('places', [])
            .set('fullIncomeArr', [])
            .drawScale(places, this.streetData)
            .removeSliders();
        }

        this.setDividers(this.placesArr, this.streetData);
      });

    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
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

    this.streetFilterSubscribe = this.street.filter.subscribe((filter: any): void => {
      let query: any = {};
      if (this.query) {
        query = this.parseUrl(this.query);
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

        streetBoxContainerMarginLeft = window.getComputedStyle(this.streetBoxContainer)
          .getPropertyValue('margin-left');
        this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

        this.setDividers(this.placesArr, this.streetData);
      });
  }

  public ngOnChanges(changes: any): void {
    if (changes.query && changes.query.currentValue) {
      let parseUrl = this.parseUrl(this.query);

      this.street.set('lowIncome', parseUrl.lowIncome);
      this.street.set('highIncome', parseUrl.highIncome);
      this.thingname = parseUrl.thing;
      this.countries = parseUrl.countries;
      this.regions = parseUrl.regions;
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

    this.streetFilterSubscribe.unsubscribe();
    this.streetServiceSubscribe.unsubscribe();

    this.street.clearAndRedraw();
    this.street.clearSvg();
  }

  private setDividers(places: any, drawDividers: any): void {
    this.street
      .clearSvg()
      .init(this.street.lowIncome, this.street.highIncome, this.streetData, this.regions, this.countries, this.thingname)
      .set('places', sortBy(places, 'income'))
      .set('fullIncomeArr', chain(this.street.places)
        .sortBy('income')
        .map((place: any) => {
          if (!place) {
            return void 0;
          }

          return this.street.scale(place.income);
        })
        .compact()
        .value())
      .drawScale(places, drawDividers);

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
