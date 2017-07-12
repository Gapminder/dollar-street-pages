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
import { AppStore } from '../../interfaces';
import { sortBy, chain } from 'lodash';
import {
  MathService,
  DrawDividersInterface
} from '../../common';
import { StreetFilterDrawService } from './street-filter.service';

@Component({
  selector: 'street-filter',
  templateUrl: './street-filter.component.html',
  styleUrls: ['./street-filter.component.css']
})
export class StreetFilterComponent implements OnDestroy, AfterViewInit {
  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public places: any[];
  @Input()
  public lowIncome: number;
  @Input()
  public highIncome: number;
  @Output()
  public filterStreet: EventEmitter<any> = new EventEmitter<any>();

  public math: MathService;
  public street: any;
  public streetData: any;
  public element: HTMLElement;
  public streetFilterSubscribe: Subscription;
  public resize: any;
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public streetSettingsStateSubscription: Subscription;

  public constructor(element: ElementRef,
                     math: MathService,
                     streetDrawService: StreetFilterDrawService,
                     store: Store<AppStore>) {
    this.element = element.nativeElement;
    this.math = math;
    this.street = streetDrawService;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
  }

  public ngAfterViewInit(): void {
    this.street.setSvg = this.svg.nativeElement;

    this.street.set('isInit', true);

    this.streetFilterSubscribe = this.street.filter.subscribe(this.filterStreet);

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;

      this.setDividers(this.places, this.streetData);
    });

    this.resize = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.setDividers(this.places, this.streetData);
      });
  }

  public ngOnDestroy(): void {
    if (this.resize) {
      this.resize.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
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
        .map((place: any) => {
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
