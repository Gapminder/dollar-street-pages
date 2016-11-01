import { Component, OnInit, Input, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { sortBy, chain } from 'lodash';

import { MathService, StreetSettingsService } from '../../common';
import { StreetFilterDrawService } from './street-filter.service';

@Component({
  selector: 'street-filter',
  templateUrl: './street-filter.component.html',
  styleUrls: ['./street-filter.component.css']
})

export class StreetFilterComponent implements OnInit, OnDestroy {
  public math: MathService;
  @Input('places')
  public places: any[];
  @Input('lowIncome')
  public lowIncome: number;
  @Input('highIncome')
  public highIncome: number;
  @Output('filterStreet')
  public filterStreet: EventEmitter<any> = new EventEmitter<any>();
  public street: any;
  public streetSettingsService: StreetSettingsService;
  public streetData: any;
  public element: HTMLElement;
  public streetFilterSubscribe: Subscription;
  public streetServiceSubscribe: Subscription;
  public resize: any;

  public constructor(element: ElementRef,
                     math: MathService,
                     streetSettingsService: StreetSettingsService,
                     streetDrawService: StreetFilterDrawService) {
    this.element = element.nativeElement;
    this.math = math;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
  }

  public ngOnInit(): any {
    this.street.setSvg = this.element.querySelector('.street-box svg') as SVGElement;
    this.street.set('isInit', true);

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;

        this.setDividers(this.places, this.streetData);
      });

    this.streetFilterSubscribe = this.street.filter.subscribe((filter: any): void => {
      this.filterStreet.emit(filter);
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

    this.streetFilterSubscribe.unsubscribe();
    this.streetServiceSubscribe.unsubscribe();
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
