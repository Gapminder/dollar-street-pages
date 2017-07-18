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
import { sortBy, chain } from 'lodash';
import { StreetSettingsService } from '../../common';
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

  private street: any;
  private streetSettingsService: StreetSettingsService;
  private streetData: any;
  private element: HTMLElement;
  private streetServiceSubscribe: Subscription;
  private resizeSubscribe: Subscription;
  private windowInnerWidth: number = window.innerWidth;

  private placesSubscribe: Subscription;
  private placesArr: any;

  public constructor(element: ElementRef,
                     streetSettingsService: StreetSettingsService,
                     streetDrawService: StreetMobileDrawService) {
    this.element = element.nativeElement;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
  }

  public ngAfterViewInit(): void {
    this.street.setSvg = this.svg.nativeElement;

    this.street.set('isInit', true);

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

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;

        if (!this.placesArr) {
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

    this.streetServiceSubscribe.unsubscribe();
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
