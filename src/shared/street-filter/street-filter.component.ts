import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  StreetSettingsState,
  DrawDividersInterface,
  Currency,
  MatrixState,
  Place
} from '../../interfaces';
import { sortBy, chain } from 'lodash';
import {
  MathService
} from '../../common';
import { StreetFilterDrawService } from './street-filter.service';
import { DEBOUNCE_TIME } from "../../defaultState";

@Component({
  selector: 'street-filter',
  templateUrl: './street-filter.component.html',
  styleUrls: ['./street-filter.component.css']
})
export class StreetFilterComponent implements OnDestroy, AfterViewInit {
  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public places: Place[];
  @Input()
  public lowIncome: number;
  @Input()
  public highIncome: number;
  @Output()
  public filterStreet: EventEmitter<any> = new EventEmitter<any>();

  public street: any;
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
  public streetFilterSubscribe: Subscription;
  public resizeSubscription: Subscription;
  public streetSettingsState: Observable<StreetSettingsState>;
  public streetSettingsStateSubscription: Subscription;
  public currencyUnit: Currency;
  public matrixState: Observable<MatrixState>;
  public matrixStateSubscription: Subscription;

  public constructor(elementRef: ElementRef,
                     streetDrawService: StreetFilterDrawService,
                     private math: MathService,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;
    this.street = streetDrawService;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngAfterViewInit(): void {
    this.street.setSvg = this.svg.nativeElement;

    this.street.set('isInit', true);

    this.streetFilterSubscribe = this.street.filter.subscribe(this.filterStreet);

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (data) {
        if (data.streetSettings) {
          if (this.streetData !== data.streetSettings) {
            this.streetData = data.streetSettings;
          }
        }
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
            this.street.currencyUnit = this.currencyUnit;

            this.setDividers(this.places, this.streetData);
          }
        }
      }
    });

    this.resizeSubscription = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.setDividers(this.places, this.streetData);
    });
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
    }

    this.streetFilterSubscribe.unsubscribe();
  }

  public setDividers(places: any, drawDividers: any): void {
    this.street
      .clearSvg()
      .init(this.lowIncome, this.highIncome, this.streetData)
      .set('places', sortBy(places, 'income'))
      .set('fullIncomeArr', chain(this.street.places)
        .sortBy('income')
        .map((place: Place) => {
          if (!place) {
            return void 0;
          }

          return this.street.scale(place.income);
        })
        .compact()
        .value())
      .drawScale(places, drawDividers);
  }
}
