import 'rxjs/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
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
  AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  DrawDividersInterface,
  Place,
  IncomeFilter, Currency, TimeUnit, SubscriptionsList,
} from '../../interfaces';
import {ActivatedRoute} from '@angular/router';
import { get, sortBy, chain, differenceBy, forEach } from 'lodash';
import {
  MathService,
  LanguageService,
} from '../../common';
import { StreetDrawService} from './street.service';
import * as StreetSettingsActions from '../../common';
import * as _ from 'lodash';
import { DEBOUNCE_TIME, DefaultUrlParameters } from '../../defaultState';
import { MatrixService } from '../../matrix/matrix.service';

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
  drawOnMap = false;
  isStreetInit = false;
  placesArr;
  streetBoxContainer: HTMLElement;
  streetBoxContainerMargin: number;
  currencyUnit: Currency;
  timeUnit: TimeUnit;
  ngSubscriptions: SubscriptionsList = {};

  constructor(elementRef: ElementRef,
    private streetDrawService: StreetDrawService,
    private activatedRoute: ActivatedRoute,
    private math: MathService,
    private languageService: LanguageService,
    private store: Store<AppStates>,
    private matrixService: MatrixService) {

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

    this.ngSubscriptions.getTranslation = this.languageService.getTranslation(['POOREST', 'RICHEST']).subscribe((trans: any) => {
      this.street.poorest = trans.POOREST.toUpperCase();
      this.street.richest = trans.RICHEST.toUpperCase();
    });

    this.ngSubscriptions.appStates = this.store
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((state: AppStates) => {
      const matrix = state.matrix;
      const streetSetting = state.streetSettings;
      const thingsFilter = state.thingsFilter;
      const countryFilter = state.countriesFilter;

        if (this.currencyUnit !== matrix.currencyUnit) {
          this.currencyUnit = matrix.currencyUnit;
          this.street.currencyUnit = this.currencyUnit;
        }

      if (this.streetData !== streetSetting.streetSettings) {
        this.streetData = streetSetting.streetSettings;

      }

        if (this.timeUnit !== matrix.timeUnit) {
          this.timeUnit = matrix.timeUnit;
          this.street.timeUnit = this.timeUnit;
        }

      if (this.placesArr && this.streetData) {
        this.setDividers(this.placesArr, this.streetData);
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

    this.ngSubscriptions.streetFilter = this.street.filter.subscribe((filter: IncomeFilter): void => {
      this.street.set('lowIncome', filter.lowIncome);
      this.street.set('highIncome', filter.highIncome);

      if (!this.isStreetInit && filter.lowIncome === this.street.lowIncome && filter.highIncome === this.street.highIncome) {
        this.isStreetInit = true;

        return;
      }
      this.store.dispatch(new StreetSettingsActions.UpdateStreetFilters({
        lowIncome: filter.lowIncome,
        highIncome: filter.highIncome
      }));
    });

    if (get(this, 'chosenPlaces', false)) {
      this.ngSubscriptions.chosenPlaces = this.chosenPlaces
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
    }

    this.ngSubscriptions.hoverPlace = this.matrixService.hoverPlace.subscribe((hoverPlace: Place): void => {
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

    if (get(this, 'places', false)) {
      this.ngSubscriptions.places = this.places.subscribe((places: Place[]): void => {
        this.placesArr = places;

        if (!this.streetData) {
          return;
        }

        if (!places.length) {
          this.redrawStreet();
        }

        this.setDividers(this.placesArr, this.streetData);
      });
    }

    this.street.filter.next({lowIncome: this.street.lowIncome, highIncome: this.street.highIncome});

    this.ngSubscriptions.resize = fromEvent(window, 'resize')
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

    forEach(this.ngSubscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    })

    if (this.street) {
      this.street.clearAndRedraw();
      this.street.clearSvg();
    }
  }

  private setDividers(places: any, drawDividers: any): void {
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
      .drawScale(places, drawDividers);

      if (this.street.chosenPlaces && this.street.chosenPlaces.length) {
        this.street.clearAndRedraw(this.street.chosenPlaces);
      }
    }
  }
}
