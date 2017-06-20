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
  OnChanges,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../ngrx/app.state';
import { AppEffects } from '../../ngrx/app.effects';
import { ActivatedRoute } from '@angular/router';
import { sortBy, chain, differenceBy } from 'lodash';
import {
  MathService,
  LanguageService
} from '../../common';
import { StreetDrawService } from './street.service';

@Component({
  selector: 'street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.css']
})
export class StreetComponent implements OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('streetBox')
  public streetBox: ElementRef;
  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public thing: string;
  @Input()
  public query: string;
  @Input()
  public places: Observable<any>;
  @Input()
  public chosenPlaces: Observable<any>;
  @Input()
  public hoverPlace: Subject<any>;
  @Output()
  public filterStreet: EventEmitter<any> = new EventEmitter<any>();

  public data: any;
  public window: Window = window;
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;
  public street: any;
  public regions: any;
  public thingname: any;
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
  public store: Store<AppStateInterface>;

  public constructor(element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     math: MathService,
                     streetDrawService: StreetDrawService,
                     languageService: LanguageService,
                     store: Store<AppStateInterface>,
                     private appEffects: AppEffects) {
    this.element = element.nativeElement;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.street = streetDrawService;
    this.languageService = languageService;
    this.store = store;
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

    this.appEffects.getDataOrDispatch(this.store, AppEffects.GET_STREET_SETTINGS).then((data: any) => {
      this.streetData = data;

      if (!this.placesArr) {
        return;
      }

      this.setDividers(this.placesArr, this.streetData);
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
