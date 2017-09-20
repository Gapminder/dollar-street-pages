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
import { AppStates } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { sortBy, chain, differenceBy } from 'lodash';
import {
  MathService,
  LanguageService,
  DrawDividersInterface,
  UtilsService
} from '../../common';
import { StreetDrawService } from './street.service';

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
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;
  public street: any;
  public regions: any;
  public thing: string;
  public thingName: any;
  public countries: any;
  public math: MathService;
  public streetData: any;
  public element: HTMLElement;
  public activatedRoute: ActivatedRoute;
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
  public streetSettingsState: Observable<DrawDividersInterface>;
  public streetSettingsStateSubscription: Subscription;
  public appState: Observable<any>;
  public appStateSubscription: Subscription;
  public thingsFilterState: Observable<any>;
  public thingsFilterStateSubscription: Subscription;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public currencyUnit: any;
  public showStreetAttrs: boolean;

  public constructor(element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     math: MathService,
                     streetDrawService: StreetDrawService,
                     languageService: LanguageService,
                     private store: Store<AppStates>,
                     private utilsService: UtilsService) {
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.street = streetDrawService;
    this.languageService = languageService;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.thingsFilterState = this.store.select((appStates: AppStates) => appStates.thingsFilter);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
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

    this.thingsFilterStateSubscription = this.thingsFilterState.subscribe((data: any) => {
      if (data) {
        if (data.thingsFilter) {
          this.thing = data.thingsFilter.thing.originPlural;
        }
      }
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (data) {
        if (this.streetData !== data.streetSettings) {
            this.streetData = data.streetSettings;
            // this.streetData = data;

            if (!this.placesArr) {
              return;
            }

            this.setDividers(this.placesArr, this.streetData);
        }

        if (data.showStreetAttrs) {
          this.showStreetAttrs = true;
        } else {
          this.showStreetAttrs = false;
        }

        this.street.showStreetAttrs = this.showStreetAttrs;
        this.redrawStreet();
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
            this.street.currencyUnit = this.currencyUnit;
          }
        }
      }
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (data.query) {
          this.query = data.query;

          let parseUrl = this.utilsService.parseUrl(this.query);

          this.street.set('lowIncome', parseUrl.lowIncome);
          this.street.set('highIncome', parseUrl.highIncome);

          this.thingName = parseUrl.thing;
          this.countries = parseUrl.countries;
          this.regions = parseUrl.regions;

          if (this.currencyUnit) {
            this.redrawStreet();
          }
        }
      }
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
        /*this.street
          .clearSvg()
          .init(this.street.lowIncome, this.street.highIncome, this.streetData, this.regions, this.countries, this.thingName)
          .set('places', [])
          .set('fullIncomeArr', [])
          .drawScale(places, this.streetData)
          .removeSliders();*/
      }

      this.setDividers(this.placesArr, this.streetData);
    });

    this.streetFilterSubscribe = this.street.filter.subscribe((filter: any): void => {
      let query: any = {};

      if (this.query) {
        query = this.utilsService.parseUrl(this.query);
      }

      query.lowIncome = filter.lowIncome;
      query.highIncome = filter.highIncome;

      /*if (!this.isStreetInit && filter.lowIncome === this.street.lowIncome && filter.highIncome === this.street.highIncome) {
        this.isStreetInit = true;

        return;
      }*/

      this.filterStreet.emit({url: this.utilsService.objToQuery(query)});
    });

    //this.street.filter.next({lowIncome: this.street.lowIncome, highIncome: this.street.highIncome});

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

    if (this.placesSubscribe) {
      this.placesSubscribe.unsubscribe();
    }

    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }

    if (this.chosenPlacesSubscribe) {
      this.chosenPlacesSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.streetFilterSubscribe) {
      this.streetFilterSubscribe.unsubscribe();
    }

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
    }

    if (this.street) {
      this.street.clearAndRedraw();
      this.street.clearSvg();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }

    if (this.thingsFilterStateSubscription) {
      this.thingsFilterStateSubscription.unsubscribe();
    }
  }

  private setDividers(places: any, drawDividers: any): void {
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
