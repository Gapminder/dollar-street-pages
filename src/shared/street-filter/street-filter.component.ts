import { Subscription } from 'rxjs/Subscription';
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
import { sortBy, chain } from 'lodash';
import {
  MathService,
  StreetSettingsService
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

  public ngAfterViewInit(): void {
    this.street.setSvg = this.svg.nativeElement;

    this.street.set('isInit', true);

    this.streetFilterSubscribe = this.street.filter.subscribe(this.filterStreet);

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
