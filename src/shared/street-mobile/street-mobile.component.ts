import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DrawDividersInterface
} from '../../common';
import { AppStore } from '../../interfaces';
import { sortBy, chain } from 'lodash';
import { StreetMobileDrawService } from './street-mobile.service';

@Component({
  selector: 'street-mobile',
  templateUrl: './street-mobile.component.html',
  styleUrls: ['./street-mobile.component.css']
})
export class StreetMobileComponent implements OnDestroy, AfterViewInit {
  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public places: Observable<any>;

  public street: any;
  public streetData: any;
  public element: HTMLElement;
  public resizeSubscribe: Subscription;
  public windowInnerWidth: number = window.innerWidth;
  public placesSubscribe: Subscription;
  public placesArr: any;
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public streetSettingsStateSubscription: Subscription;

  public constructor(element: ElementRef,
                     streetDrawService: StreetMobileDrawService,
                     store: Store<AppStore>) {
    this.element = element.nativeElement;
    this.street = streetDrawService;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
  }

  public ngAfterViewInit(): void {
    this.street.setSvg = this.svg.nativeElement;

    this.street.set('isInit', true);

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;

      if (!this.placesArr) {
        return;
      }

      this.setDividers(this.placesArr);
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        if (!this.street.places || this.windowInnerWidth === window.innerWidth) {
          return;
        }

        this.setDividers(this.placesArr);
      });

    this.placesSubscribe = this.places && this.places
        .subscribe((places: any): void => {
          this.placesArr = places;

          if (!this.streetData) {
            return;
          }

          this.setDividers(this.placesArr);
        });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();

    if (this.placesSubscribe) {
      this.placesSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
  }

  private setDividers(places: any): void {
    this.street
      .clearSvg()
      .init(this.streetData)
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
      .drawScale(places);
  }
}
