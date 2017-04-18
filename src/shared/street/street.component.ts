import 'rxjs/operator/debounceTime';

import { Component, OnInit, Input, Output, ElementRef, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { sortBy, chain, differenceBy } from 'lodash';

import { MathService, StreetSettingsService, LanguageService } from '../../common';
import { StreetDrawService } from './street.service';

@Component({
  selector: 'street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.css']
})

export class StreetComponent implements OnInit, OnDestroy, OnChanges {
  public data: any;
  @Input('thing')
  public thing: string;
  @Input('query')
  public query: string;
  @Input('places')
  public places: Observable<any>;
  @Input('chosenPlaces')
  public chosenPlaces: Observable<any>;
  @Input('hoverPlace')
  public hoverPlace: Subject<any>;
  @Output('filterStreet')
  public filterStreet: EventEmitter<any> = new EventEmitter<any>();
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;
  public street: any;
  public regions: any;
  public thingname: any;
  public countries: any;
  public math: MathService;
  public streetSettingsService: StreetSettingsService;
  public streetData: any;
  public element: HTMLElement;
  public activatedRoute: ActivatedRoute;
  public streetServiceSubscribe: Subscription;
  public resize: any;
  public drawOnMap: boolean = false;
  public isStreetInit: boolean = false;

  public placesSubscribe: Subscription;
  public hoverPlaceSubscribe: Subscription;
  public chosenPlacesSubscribe: Subscription;
  public streetFilterSubscribe: Subscription;
  public placesArr: any;
  public streetBoxContainer: HTMLElement;
  public streetBoxContainerMargin: number;

  public constructor(element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     math: MathService,
                     streetSettingsService: StreetSettingsService,
                     streetDrawService: StreetDrawService,
                     languageService: LanguageService) {
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
    this.languageService = languageService;
  }

  public ngOnInit(): any {
    this.street.setSvg = this.element.querySelector('.street-box svg') as SVGElement;
    this.streetBoxContainer = this.element.querySelector('.street-box') as HTMLElement;
    let streetBoxContainerMarginLeft: string = window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');
    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;
    this.street.set('isInit', true);
    this.street.set('chosenPlaces', []);

    this.getTranslationSubscribe = this.languageService.getTranslation(['POOREST', 'RICHEST']).subscribe((trans: any) => {
      this.street.poorest = trans.POOREST.toUpperCase();
      this.street.richest = trans.RICHEST.toUpperCase();
    });

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces: any): void => {
      let difference: any[] = differenceBy(chosenPlaces, this.street.chosenPlaces, '_id');
      if (this.street.width + this.street.streetOffset + this.streetBoxContainerMargin !== document.body.offsetWidth &&
        this.placesArr &&
        this.streetData) {
        this.setDividers(this.placesArr, this.streetData);

        return;
      }

      if (difference.length || chosenPlaces.length !== this.street.chosenPlaces.length) {
        this.street.set('chosenPlaces', chosenPlaces.length ? chosenPlaces : []);

        if (!this.street.scale) {
          return;
        }

        this.street.clearAndRedraw(chosenPlaces);
      }
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

    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings().subscribe((res: any) => {
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

      if (!this.isStreetInit && filter.lowIncome === this.street.lowIncome && filter.highIncome === this.street.highIncome) {
        this.isStreetInit = true;

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

    this.getTranslationSubscribe.unsubscribe();

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
