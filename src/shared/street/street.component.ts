import 'rxjs/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  Input,
  Output,
  ElementRef,
  OnDestroy,
  EventEmitter,
  ViewChild,
  AfterViewInit, AfterViewChecked
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  DrawDividersInterface,
  Place,
  IncomeFilter, Currency,
} from '../../interfaces';
import {ActivatedRoute} from '@angular/router';
import { sortBy, chain, differenceBy } from 'lodash';
import {
  MathService,
  LanguageService,
  UtilsService
} from '../../common';
import { StreetDrawService} from './street.service';
import * as StreetSettingsActions from '../../common';
import * as _ from 'lodash';
import { DEBOUNCE_TIME, DefaultUrlParameters } from '../../defaultState';

const FREQUENCY_UPDATE_STREET = 10;

@Component({
  selector: 'street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.css']
})
export class StreetComponent implements OnDestroy, AfterViewInit {
  @ViewChild('streetBox')
  streetBox: ElementRef;
  @ViewChild('svg')
  svg: ElementRef;

  @Input()
  places: Observable<any>;
  @Input()
  chosenPlaces: Observable<any>;
  @Input()
  hoverPlace: Subject<any>;
  @Output()
  filterStreet: EventEmitter<any> = new EventEmitter<any>();

  query: string;
  data: any;
  window: Window = window;
  getTranslationSubscribe: Subscription;
  street;
  regions;
  thingName;
  countries;
  streetData: DrawDividersInterface;
  element: HTMLElement;
  resize;
  drawOnMap = false;
  isStreetInit = false;
  placesSubscribe: Subscription;
  hoverPlaceSubscribe: Subscription;
  chosenPlacesSubscribe: Subscription;
  streetFilterSubscribe: Subscription;
  placesArr;
  streetBoxContainer: HTMLElement;
  streetBoxContainerMargin: number;
  currencyUnit: Currency;
  appStatesSubscription: Subscription;

  constructor(elementRef: ElementRef,
                     streetDrawService: StreetDrawService,
                     private activatedRoute: ActivatedRoute,
                     private math: MathService,
                     private languageService: LanguageService,
                     private store: Store<AppStates>,
                     private utilsService: UtilsService) {
    this.element = elementRef.nativeElement;
    this.street = streetDrawService;
  }

  ngAfterViewInit(): void {
    this.street.setSvg = this.svg.nativeElement;
    this.streetBoxContainer = this.streetBox.nativeElement;

    let streetBoxContainerMarginLeft: string = this.window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');

    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

    this.street.set('isInit', true);
    this.street.set('chosenPlaces', []);

    this.getTranslationSubscribe = this.languageService.getTranslation(['POOREST', 'RICHEST']).subscribe((trans: any) => {
      this.street.poorest = trans.POOREST.toUpperCase();
      this.street.richest = trans.RICHEST.toUpperCase();
    });

    this.appStatesSubscription = this.store
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((state: AppStates) => {
      const matrix = state.matrix;
      const streetSetting = state.streetSettings;
      const thingsFilter = state.thingsFilter;
      const countryFilter = state.countriesFilter;
        console.log(matrix);
        if (this.currencyUnit !== matrix.currencyUnit) {
        this.currencyUnit = matrix.currencyUnit;
        this.street.currencyUnit = this.currencyUnit;
      }
        console.log(matrix.timeUnit.per)
      if (this.streetData !== streetSetting.streetSettings) {
        this.streetData = streetSetting.streetSettings;

      }

      if (this.placesArr && this.streetData) {
        console.log(matrix.timeUnit.per)
        const factorTimeUnit = this.street.factorTimeUnit(matrix.timeUnit.per);

        this.setDividers(this.placesArr, this.streetData, factorTimeUnit);

      }

      const lowIncome = _.get(streetSetting.streetSettings, 'filters.lowIncome', DefaultUrlParameters.lowIncome);
      const highIncome = _.get(streetSetting.streetSettings, 'filters.highIncome', DefaultUrlParameters.highIncome)
      this.street.set('lowIncome', lowIncome);
      this.street.set('highIncome', highIncome);

      if (_.get(thingsFilter.thingsFilter, 'thing', false)) {
        this.thingName = thingsFilter.thingsFilter.thing.originPlural;
      }
      this.countries = countryFilter.selectedCountries;
      this.regions = countryFilter.selectedRegions;

      if (this.currencyUnit && this.countries) {
        this.redrawStreet();
      }

    });

    this.streetFilterSubscribe = this.street.filter.subscribe((filter: IncomeFilter): void => {
      this.street.set('lowIncome', filter.lowIncome);
      this.street.set('highIncome', filter.highIncome);

      if (!this.isStreetInit && filter.lowIncome === this.street.lowIncome && filter.highIncome === this.street.highIncome) {
        this.isStreetInit = true;

        return;
      }
      this.store.dispatch(new StreetSettingsActions.UpdateStreetFilters({
        lowIncome: filter.lowIncome,
        highIncome: filter.highIncome
      }))
    });

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces
      .debounceTime(FREQUENCY_UPDATE_STREET)
      .subscribe((chosenPlaces: any): void => {
        const difference = differenceBy(chosenPlaces, this.street.chosenPlaces, '_id');

      if (this.placesArr && this.streetData) {
        this.setDividers(this.placesArr, this.streetData);
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

    this.placesSubscribe = this.places && this.places.subscribe((places: Place[]): void => {
      this.placesArr = places;

      if (!this.streetData) {
        return;
      }

      if (!places.length) {
        this.redrawStreet();
      }

      this.setDividers(this.placesArr, this.streetData);
    });

    this.street.filter.next({lowIncome: this.street.lowIncome, highIncome: this.street.highIncome});

    this.resize = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
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

  redrawStreet(): void {
    if (
      this.street.lowIncome
      && this.street.highIncome
      && this.streetData
      && this.regions
      && this.countries
      && this.thingName
    ) {
    this.street
      .clearSvg()
      .init(this.street.lowIncome, this.street.highIncome, this.streetData, this.regions, this.countries, this.thingName)
      .set('places', [])
      .set('fullIncomeArr', [])
      .drawScale(this.placesArr, this.streetData)
      .removeHouses('chosen')
      .removeHouses('hover')
      .removeSliders();
    }
  }

  ngOnDestroy(): void {
    if (this.resize) {
      this.resize.unsubscribe();
    }

    if (this.appStatesSubscription) {
      this.appStatesSubscription.unsubscribe();
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

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.streetFilterSubscribe) {
      this.streetFilterSubscribe.unsubscribe();
    }

    if (this.street) {
      this.street.clearAndRedraw();
      this.street.clearSvg();
    }
  }

  private setDividers(places: any, drawDividers: any, factorTimeUnit = 1): void {
    if (this.street.lowIncome && this.street.highIncome && this.streetData && this.regions && this.countries && this.thingName) {
    this.street
      .clearSvg()
      .init(this.street.lowIncome, this.street.highIncome, this.streetData, this.regions, this.countries, this.thingName)
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
      .drawScale(places, drawDividers, factorTimeUnit);

      if (this.street.chosenPlaces && this.street.chosenPlaces.length) {
        this.street.clearAndRedraw(this.street.chosenPlaces);
      }
    }
  }
}
