import 'rxjs/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Rx';
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
  StreetSettingsState,
  DrawDividersInterface,
  AppState,
  MatrixState
} from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { sortBy, chain, differenceBy } from 'lodash';
import {
  MathService,
  LanguageService,
  UtilsService
} from '../../common';
import { StreetDrawService} from './street.service';
import * as StreetSettingsActions from '../../common';
import * as _ from "lodash";

@Component({
  selector: 'street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.css']
})
export class StreetComponent implements OnDestroy, AfterViewInit {
  @ViewChild('streetBox')
  public streetBox: ElementRef;
  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public places: Observable<any>;
  @Input()
  public chosenPlaces: Observable<any>;
  @Input()
  public hoverPlace: Subject<any>;
  @Output()
  public filterStreet: EventEmitter<any> = new EventEmitter<any>();

  public query: string;
  public data: any;
  public window: Window = window;
  public getTranslationSubscribe: Subscription;
  public street: any;
  public regions: any;
  public thingName: any;
  public countries: any;
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
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
  public currencyUnit: any;
  public appStatesSubscription: Subscription;

  public constructor(elementRef: ElementRef,
                     streetDrawService: StreetDrawService,
                     private activatedRoute: ActivatedRoute,
                     private math: MathService,
                     private languageService: LanguageService,
                     private store: Store<AppStates>,
                     private utilsService: UtilsService) {
    this.element = elementRef.nativeElement;
    this.street = streetDrawService;
  }

  public ngAfterViewInit(): any {
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

    this.appStatesSubscription = this.store.debounceTime(100).subscribe((state: AppStates) => {
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

        if (this.placesArr) {
          this.setDividers(this.placesArr, this.streetData);
        }
      }

      const lowIncome = _.get(streetSetting.streetSettings, 'filters.lowIncome', streetSetting.streetSettings.poor);
      const highIncome = _.get(streetSetting.streetSettings, 'filters.highIncome', streetSetting.streetSettings.rich)
      this.street.set('lowIncome', lowIncome);
      this.street.set('highIncome', highIncome);

      this.thingName = thingsFilter.thingsFilter.thing.plural;
      this.countries = countryFilter.selectedCountries;
      this.regions = countryFilter.selectedRegions;

      if (this.currencyUnit && this.countries) {
        this.redrawStreet();
      }

    });

    this.streetFilterSubscribe = this.street.filter.subscribe((filter: any): void => {

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

    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((chosenPlaces: any): void => {
      let difference: any[] = differenceBy(chosenPlaces, this.street.chosenPlaces, '_id');

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

    this.placesSubscribe = this.places && this.places.subscribe((places: any): void => {
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

  public redrawStreet(): void {
    this.street
      .clearSvg()
      .init(this.street.lowIncome, this.street.highIncome, this.streetData, this.regions, this.countries, this.thingName)
      .set('places', [])
      .set('fullIncomeArr', [])
      .drawScale(this.placesArr, this.streetData)
      .removeSliders();
  }

  public ngOnDestroy(): void {
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
